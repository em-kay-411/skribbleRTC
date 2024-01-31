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

const PORT = process.env.PORT || 3000;

const rooms = {};

const name = {};

io.on('connection', (socket) => {
    console.log('Connected user');

    // socket.on('joinRoom', (data) => {
    //     if(rooms[data.roomID]){
    //         socket.join(data.roomID);
    //         name[socket.id] = {name : data.name};
    //         rooms[data.roomID].users.push(socket.id);
    //     }
    //     else{
    //         socket.emit('error');
    //     }
    // })

    // socket.on('createRoom', (data) => {
    //     if (!rooms[data.roomID]) {
    //         socket.join(data.roomID);
    //         name[socket.id] = {name : data.name};
    //         rooms[data.roomID] = {creator : socket.id, users : [socket.id]};
    //     } else {
    //         socket.emit('displayRoomID', 'Room Already Exists');
    //     }
    // })

    socket.on('join-room', (roomID, userId) => {
        socket.join(roomID)
        socket.to(roomID).emit('user-connected', userId);

        socket.on('disconnect', () => {
            io.to(roomID).emit('user-disconnected', userId)
        })
    })

    // socket.on('disconnect', () => {
    //     for(const room in rooms){
    //         if(room.creator === socket.id){
    //             delete rooms[room];
    //         }
    //         else{
    //             const index = rooms[room].users.indexOf(socket.id);
    //             if(index !== -1){
    //                 rooms[room].users.splice(index, 1);
    //             }
    //         }
    //     }
    // })
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
