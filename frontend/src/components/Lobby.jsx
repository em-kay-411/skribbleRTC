import React, { useEffect, useRef, useState } from 'react';
import '../css/Lobby.css'
import { Peer } from "https://esm.sh/peerjs@1.5.2?bundle-deps"
import io from 'socket.io-client';
// ... (imports)

const Lobby = () => {
  const socket = io('http://localhost:8000');
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [action, setAction] = useState('success');

  const generateRoomID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  const createRoomRequest = (event) => {
    event.preventDefault();
    try {
      socket.emit('createRoom', { name, roomID: generateRoomID() });
      setAction('success');
    } catch (error) {
      setAction('failure');
    }
  }

  const joinRoomRequest = (event) => {
    event.preventDefault();
    try {
      socket.emit('joinRoom', { name, roomID });
    } catch (error) {
      setAction('failure');
    }
  }

  return (
    <div className="container">
      <form className='form' id='new-room'>
        <div className="heading">create room</div>
        <input
          type="text"
          name="name"
          placeholder='enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type='submit' onClick={createRoomRequest}>create</button>
      </form>
      <form className='form' id='enter-room'>
        <div className="heading">join room</div>
        <input
          type="text"
          name="name"
          placeholder='enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="roomID"
          placeholder='enter room ID'
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
        />
        <button type='submit' onClick={joinRoomRequest}>join</button>
      </form>
    </div>
  );
}

export default Lobby;