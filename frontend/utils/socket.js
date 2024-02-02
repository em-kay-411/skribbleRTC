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

socket.on('game-started', () => {
    stage.style.display = 'flex';
    mountCanvas();
    // socket.emit('switch-turn')
})

socket.on('set-turn', (data) => {
    cleanCanvas();
    artist.innerHTML = `${data.nameUser} is drawing`;
    round.innerHTML = `${data.currentRound}/${rounds}`
    startTimer(drawtime);
})

socket.on('allow-drawing', () => {
    answer = '';
    writing = true;
    artist.innerHTML = `your turn`;
    guess.disabled = true;
})

socket.on('display-word', (data) => {
    word.innerHTML = `${data}`;
})

socket.on('send-answer', (word) => {
    answer = word;
});
