function createRoom(username, roomID, players, drawtime, rounds) {
    socket.emit('create-room', ({username, roomID, players, drawtime, rounds}));
    document.getElementById('room').innerHTML = `${roomID}`
    routeToRoom();
    setPeer();
}