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


const PORT = process.env.PORT || 3000;

const rooms = {};
const name = [];
const peerID = [];

io.on('connection', (socket) => {
    console.log('Connected user');

    socket.on('create-room', (data) => {
        if (!rooms[data.roomID]) {
            rooms[data.roomID] = { creator: socket.id, players: data.players, drawtime: data.drawtime, rounds: data.rounds, users: [socket.id], playing: false, currentRound: 0, turn: 0 };
            name[socket.id] = data.username;
            console.log(rooms[data.roomID].creator);
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
                console.log(rooms[data.roomID].users.length);
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
                rooms[data.roomID].playing = true;
                socket.to(data.roomID).emit('game-started');
            })

            socket.on('switch-turn', () => {
                const turn = (rooms[data.roomID].turn) % (rooms[data.roomID].users.length + 1);
                const num = turn - 1;
                let currentRound = rooms[data.roomID].currentRound;
                if (num == -1) {
                    currentRound = currentRound + 1;
                    if (currentRound > rooms[data.roomID].rounds) {
                        io.to(data.roomID).emit('end-game');
                    }
                    else {
                        rooms[data.roomID].currentRound = currentRound;
                        const nameUser = name[rooms[data.roomID].creator];
                        io.to(data.roomID).emit('set-turn', ({ nameUser, currentRound }));
                        io.to(rooms[data.roomID].creator).emit('allow-drawing');
                        rooms[data.roomID].turn = turn + 1;
                    }
                }
                else {
                    const nameUser = name[rooms[data.roomID].users[num]];
                    io.to(data.roomID).emit('set-turn', ({ nameUser, currentRound }));
                    io.to(rooms[data.roomID].users[num]).emit('allow-drawing');
                    rooms[data.roomID].turn = turn + 1;
                }
            })

            socket.on('disconnect', () => {
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
