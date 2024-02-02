const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});

const words = [
    'elephant', 'jazz', 'whisper', 'cactus', 'giraffe', 'xylophone', 'quasar', 'breeze', 'sphinx', 'moonlight',
    'avalanche', 'chocolate', 'paradox', 'gondola', 'harmony', 'quokka', 'hologram', 'serendipity', 'twilight', 'umbrella',
    'acoustic', 'butterfly', 'zeppelin', 'flamingo', 'mysterious', 'cascade', 'enigma', 'kaleidoscope', 'labyrinth', 'polynomial',
    'vortex', 'nectarine', 'cosmic', 'carousel', 'platypus', 'volcano', 'asparagus', 'whimsical', 'fandango', 'umbilical',
    'xenon', 'oblivion', 'intricate', 'cucumber', 'sardine', 'lullaby', 'quasar', 'rhombus', 'hurricane', 'ephemeral',
    'bungalow', 'obfuscate', 'elusive', 'ephemeral', 'ludicrous', 'paragon', 'mellifluous', 'azure', 'gazelle', 'xerox',
    'serenity', 'harlequin', 'juxtapose', 'ephemeral', 'quixotic', 'insidious', 'luminous', 'turbulent', 'oblivion', 'gargoyle',
    'xenophobia', 'syzygy', 'facetious', 'whistle', 'opulent', 'quandary', 'euphoria', 'sonorous', 'zephyr', 'quibble',
    'bourgeois', 'surreptitious', 'discombobulate', 'ephemeral', 'ineffable', 'languid', 'mellifluous', 'onomatopoeia', 'quizzical', 'serendipity',
    'verisimilitude', 'ubiquitous', 'ziggurat', 'capricious'
];

function getWord() {
    const randomIndex = Math.floor(Math.random() * 100);
    return words[randomIndex];
}


const PORT = process.env.PORT || 3000;

const rooms = {};
const name = [];
const peerID = [];

io.on('connection', (socket) => {
    console.log('Connected user');

    socket.on('create-room', (data) => {
        if (!rooms[data.roomID]) {
            rooms[data.roomID] = { creator: socket.id, players: data.players, drawtime: data.drawtime, rounds: data.rounds, users: [socket.id], playing: false, currentRound: 0, turn: 0, word: '', correctAnswers: 0 };
            name[socket.id] = data.username;
            // console.log(rooms[data.roomID].creator);
            socket.join(data.roomID);
            socket.emit('accessGranted')
        }
        else {
            socket.emit('room-already-exists');
        }
    });

    socket.on('join-room', (data) => {
        if (rooms[data.roomID]) {
            // console.log(rooms[data.roomID].users.length, rooms[data.roomID].players);
            if ((!rooms[data.roomID].playing) && (rooms[data.roomID].users.length < rooms[data.roomID].players)) {
                // console.log(rooms[data.roomID].users.length);
                name[socket.id] = data.username;
                rooms[data.roomID].users.push(socket.id);
                socket.join(data.roomID);
                socket.emit('roomData', rooms[data.roomID]);
                socket.emit('accessGranted')
            }
            else if (rooms[data.roomID].playing) {
                socket.emit('entry-prohibited');
            }
            else {
                socket.emit('roomFull');
            }
        }
        else {
            socket.emit('invalid-room')
        }
    });

    socket.on('get-peer-name', (id) => {
        const peerName = name[peerID[id]];
        socket.emit('peer-name', peerName);
    })

    socket.on('join-peer-to-room', (data) => {
        if (rooms[data.roomID].users.length <= rooms[data.roomID].players) {
            peerID[data.userID] = socket.id;
            socket.to(data.roomID).emit('user-connected', data.userID);

            if (rooms[data.roomID].users.length == 2) {
                socket.to(rooms[data.roomID].creator).emit('play-button-appear');
            }

            socket.on('start-game', () => {
                // console.log('start-game');
                rooms[data.roomID].playing = true;
                socket.to(data.roomID).emit('game-started');
                const turn = (rooms[data.roomID].turn) % (rooms[data.roomID].users.length);
                let currentRound = rooms[data.roomID].currentRound;
                currentRound = currentRound + 1;
                rooms[data.roomID].currentRound = currentRound;
                const nameUser = name[rooms[data.roomID].creator];
                io.to(data.roomID).emit('set-turn', ({ nameUser, currentRound }));
                io.to(rooms[data.roomID].creator).emit('allow-drawing');
                const word = getWord();
                // console.log('word obtained', word);
                rooms[data.roomID].word = word;
                // console.log('word in room set to ', rooms[data.roomID].word)
                socket.to(data.roomID).emit('send-answer', (word));
                io.to(rooms[data.roomID].creator).emit('display-word', (word));
                rooms[data.roomID].turn = turn + 1;
            });

            socket.on('drawLine', (coordinates) => {
                socket.to(data.roomID).emit('drawLine', (coordinates));
            });

            socket.on('increment-correct-answer', () => {
                // console.log('entered increment-correct-answer')
                const correctAnswers = rooms[data.roomID].correctAnswers;
                rooms[data.roomID].correctAnswers = correctAnswers + 1;

                if(rooms[data.roomID].correctAnswers === rooms[data.roomID].players - 1){
                    io.to(rooms[data.roomID].users[(rooms[data.roomID].turn) - 1]).emit('all-answer-interrupt-writer');
                    io.to(data.roomID).emit('all-answer-interrupt-guesser');
                    rooms[data.roomID].correctAnswers = correctAnswers + 1;
                }
            })

            socket.on('switch-turn', () => {
                const turn = (rooms[data.roomID].turn) % (rooms[data.roomID].users.length);
                // console.log('switch-turn');
                // console.log('turn', turn);
                let currentRound = rooms[data.roomID].currentRound;
                if (turn === 0) {
                    currentRound = currentRound + 1;
                    rooms[data.roomID].currentRound = currentRound;
                }

                if (currentRound > rooms[data.roomID].rounds) {
                    io.to(data.roomID).emit('end-game');
                }
                else {
                    const nameUser = name[rooms[data.roomID].users[turn]];
                    io.to(data.roomID).emit('set-turn', ({ nameUser, currentRound }));
                    io.to(rooms[data.roomID].users[turn]).emit('allow-drawing');
                    const word = getWord();
                    rooms[data.roomID].word = word;
                    socket.to(data.roomID).emit('send-answer', (word));
                    socket.emit('send-answer', (word));
                    io.to(rooms[data.roomID].users[turn]).emit('display-word', (word));
                    rooms[data.roomID].turn = turn + 1;
                }
            })

            socket.on('disconnect', () => {
                // Warning!!! Need to handle this.. The program will crash if a non-creator enters here.......
                if (!rooms[data.roomID].creator) {
                    console.log('need to handle')                   // Need to handle
                }
                else if (rooms[data.roomID].creator === socket.id) {
                    delete rooms[data.roomID];
                }
                else {
                    const index = rooms[data.roomID].users.indexOf(socket.id);
                    if (index !== -1) {
                        rooms[data.roomID].users.splice(index, 1);
                    }
                }
                io.to(data.roomID).emit('user-disconnected', data.userID);
            })
        }
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
