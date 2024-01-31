function joinRoom(username, roomID) {
    socket.emit('join-room', ({username, roomID}));
}