function createRoom(username, roomID, players, drawtime, rounds) {
    socket.emit('create-room', ({username, roomID, players, drawtime, rounds}));
    document.getElementById('room').style.display = 'flex';
    document.getElementById('room-id').innerHTML = `${roomID}`;
    // routeToRoom();
    // setPeer();
}