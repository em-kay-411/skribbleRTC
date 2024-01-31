function joinRoom(username, roomID) {
    socket.emit('join-room', ({username, roomID}));

    socket.on('accessGranted', () => {
        routeToRoom();
        setPeer();
    })

    socket.on ('roomFull', () => {
        notification.innerHTML = 'room full';
        console.log(notification);
    })
}

socket.on('roomData', (data) => {
    players = data.players;
    drawtime = data.drawtime;
    rounds = data.rounds;
})