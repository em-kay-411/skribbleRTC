const socket = io('http://localhost:3000')
const usernameElement = document.getElementById('username');
const playersElement = document.getElementById('players');
const drawtimeElement = document.getElementById('drawtime');
const roundsElement = document.getElementById('rounds');
const roomIDElement = document.getElementById('roomID');
const createButton = document.getElementById('createButton');
const joinButton = document.getElementById('joinButton');
const playButton = document.getElementById('playButton');
const videos = document.getElementById('video-container');
const notification = document.getElementById('notification');
const artist = document.getElementById('artist');
const round = document.getElementById('round');
const timer = document.getElementById('timer');
const stage = document.getElementById('stage');
const tools = document.getElementById('tools');
const canvasContainer = document.getElementById('canvas-container');
const guess = document.getElementById('guess');
const word = document.getElementById('word');
const blue = document.getElementById('blue');
const green = document.getElementById('green');
const yellow = document.getElementById('yellow');
const red = document.getElementById('red');
const orange = document.getElementById('orange');
const black = document.getElementById('black');
const white = document.getElementById('white');
const write = document.getElementById('write');
const erase = document.getElementById('erase');
let color = 'black';
let shape = 'freeform';
let answer = '';
let username, roomID, players, drawtime, rounds;
let writing = false;

write.onclick = () => {
    shape = 'freeform';
}

erase.onclick = () => {
    shape = 'erase';
}

blue.onclick = () => {
    color = 'blue';
}

green.onclick = () => {
    color = 'green';
}

yellow.onclick = () => {
    color = 'yellow';
}

red.onclick = () => {
    color = 'red';
}

orange.onclick = () => {
    color = 'orange';
}

black.onclick = () => {
    color = 'black';
}

white.onclick = () => {
    color = 'white';
}

createButton.onclick = () => {
    roomID = generateRoomID(12);
    if (!username || !players || !drawtime || !rounds) {
        notify('enter valid fields')
        return;
    }
    createRoom(username, roomID, players, drawtime, rounds);
}

joinButton.onclick = () => {
    if (!username || !roomID) {
        notify('enter valid fields')
    }
    joinRoom(username, roomID);
}

usernameElement.onchange = () => {
    if (usernameElement.value > 8) {
        usernameElement.value = 8;
    }
    if (usernameElement.value < 1) {
        usernameElement.value = 1
    }
    username = usernameElement.value
}

roomIDElement.onchange = () => {
    roomID = roomIDElement.value;
}

playersElement.onchange = () => {
    if (playersElement.value > 8) {
        playersElement.value = 8;
    }
    if (playersElement.value < 1) {
        playersElement.value = 1
    }
    players = playersElement.value
}

drawtimeElement.onchange = () => {
    if (drawtimeElement.value > 120) {
        drawtimeElement.value = 120;
    }
    if (drawtimeElement.value < 30) {
        drawtimeElement.value = 30;
    }
    drawtime = drawtimeElement.value;
}

roundsElement.onchange = () => {
    if (roundsElement.value > 10) {
        roundsElement.value = 10;
    }
    if (roundsElement.value < 1) {
        roundsElement.value = 1;
    }
    rounds = roundsElement.value;
}

playButton.onclick = () => {
    socket.emit('start-game');
    playButton.style.display = 'none';
    stage.style.display = 'flex';
    mountCanvas();
}

guess.oninput = () => {
    if(guess.value === answer){
        word.innerHTML = `you're right : ${answer}`;
        guess.disabled = true;
    }
}