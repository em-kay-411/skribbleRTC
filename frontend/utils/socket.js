socket.on('accessGranted', () => {
    notify('access granted');
    routeToRoom();
    setPeer();
})

socket.on ('roomFull', () => {
    notify('the room is full');
})

socket.on('room-already-exists', () => {
    notify('server error ! try again');
})

socket.on('invalid-room', () => {
    notify('no such room exists');
})

socket.on('roomData', (data) => {
    players = data.players;
    drawtime = data.drawtime;
    rounds = data.rounds;
})