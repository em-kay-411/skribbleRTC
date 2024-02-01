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

socket.on('entry-prohibited', () => {
    notify('Entry Prohibited! The room owner has started the game');
})

socket.on('roomData', (data) => {
    players = data.players;
    drawtime = data.drawtime;
    rounds = data.rounds;
})

socket.on('play-button-appear', () => {
    playButton.style.display = 'block';
})