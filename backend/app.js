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
        rooms[data.roomID] = { creator: socket.id, players: data.players, drawtime: data.drawtime, rounds: data.rounds, users: [socket.id] };
        name[socket.id] = data.username;
        socket.join(data.roomID);
    });

    socket.on('join-room', (data) => {
        if (rooms[data.roomID]) {
            if (rooms[data.roomID].users.length <= rooms[data.roomID].players) {
                name[socket.id] = data.username;
                rooms[data.roomID].users.push(socket.id);
                socket.join(data.roomID);
                socket.emit('roomData', rooms[data.roomID]);
            }
        }
    })

    socket.on('join-peer-to-room', (data) => {
        console.log('joining peer to room')
        peerID[socket.id] = data.userID;
        socket.to(data.roomID).emit('user-connected', data.userID);

        socket.on('disconnect', () => {
            io.to(data.roomID).emit('user-disconnected', data.userID);
        })
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
