// server.js
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

const PORT = process.env.PORT || 8000;

const rooms = {};

io.on('connection', (socket) => {
    console.log('Connected user');

    socket.on('joinRoom', (data) => {
        if(rooms[data.roomID]){
            socket.join(data.roomID);
            rooms[data.roomID].users.push(data.name);
            socket.emit('displayRoomID', data);
        }
        else{
            socket.emit('error');
        }
    })

    socket.on('createRoom', (data) => {
        if (!rooms[data.roomID]) {
            socket.join(data.roomID);
            rooms[data.roomID] = {creator : socket.id, users : [data.name]};
            socket.emit('displayRoomID', data);
        } else {
            socket.emit('displayRoomID', 'Room Already Exists');
        }
    })
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
