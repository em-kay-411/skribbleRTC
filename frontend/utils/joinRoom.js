function joinRoom(username, roomID) {
    socket.emit('join-room', ({username, roomID}));
    routeToRoom();
    setPeer();
}

socket.on('roomData', (data) => {
    players = data.players;
    drawtime = data.drawtime;
    rounds = data.rounds;

    console.log(players, drawtime, rounds);
})