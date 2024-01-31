const socket = io('http://localhost:3000')
const usernameElement = document.getElementById('username');
const playersElement = document.getElementById('players');
const drawtimeElement = document.getElementById('drawtime');
const roundsElement = document.getElementById('rounds');
const roomIDElement = document.getElementById('roomID');
const createButton = document.getElementById('createButton');
const joinButton = document.getElementById('joinButton');
let username, roomID, players, drawtime, rounds;

createButton.onclick = () => {
    roomID = generateRoomID(12);
    if(!username || !roomID || !players || !drawtime || !rounds){
        console.log('enter all the fields correctly.')
    }
    createRoom(username, roomID, players, drawtime, rounds);
}

joinButton.onclick = () => {
    if(!username || !roomID){
        console.log('enter all the fields correctly')
    }
    joinRoom(username, roomID);
}

usernameElement.onchange = () => {
    if(usernameElement.value > 8){
        usernameElement.value = 8;
    }
    if(usernameElement.value < 1){
        usernameElement.value =1
    }
    username = usernameElement.value
}

playersElement.onchange = () => {
    if(playersElement.value > 8){
        playersElement.value = 8;
    }
    if(playersElement.value < 1){
        playersElement.value =1
    }
    players = playersElement.value
}

drawtimeElement.onchange = () => {
    if(drawtimeElement.value > 120){
        drawtimeElement.value = 120;
    }
    if(drawtimeElement.value < 30){
        drawtimeElement.value = 30;
    }

    drawtime = drawtimeElement.value;
}

roundsElement.onchange = () => {
    if(roundsElement.value > 10){
        roundsElement.value = 10;
    }
    if(roundsElement.value < 1){
        roundsElement.value = 1;
    }

    rounds = roundsElement.value;
}