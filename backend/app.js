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
        if(!rooms[data.roomID]){
            rooms[data.roomID] = { creator: socket.id, players: data.players, drawtime: data.drawtime, rounds: data.rounds, users: [socket.id] };
            name[socket.id] = data.username;
            socket.join(data.roomID);
        }
        else{
            socket.emit('room-already-exists');
        }
    });

    socket.on('join-room', (data) => {
        if (rooms[data.roomID]) {
            if (rooms[data.roomID].users.length < rooms[data.roomID].players) {
                console.log(rooms[data.roomID].users.length);
                name[socket.id] = data.username;
                rooms[data.roomID].users.push(socket.id);
                socket.join(data.roomID);
                socket.emit('roomData', rooms[data.roomID]);
            }
            else{
                socket.emit('roomFull');
            }
        }
        else {
            socket.emit('invalid-room')
        }
    })

    socket.on('join-peer-to-room', (data) => {
        if (rooms[data.roomID].users.length <= rooms[data.roomID].players) {
            peerID[socket.id] = data.userID;
            socket.to(data.roomID).emit('user-connected', data.userID);

            socket.on('disconnect', () => {
                if(rooms[data.roomID].creator === socket.id){
                    delete rooms[data.roomID];
                }
                else{
                    const index = rooms[data.roomID].users.indexOf(socket.id);
                    if(index !== -1){
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
