import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../css/Lobby.css';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const navigate = useNavigate();
  const socketRef = useRef(); // Use useRef to hold the socket instance

  const generateRoomID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  };

  const handleGotoRoom = useCallback(() => {
    console.log(roomID);
    navigate(`/room/${roomID}`);
  }, [navigate, roomID]);

  const createRoomRequest = (event) => {
    event.preventDefault();
    try {
      const socket = io('http://localhost:8000');
      socketRef.current = socket; // Save the socket instance to the ref
      const id = generateRoomID();
      socket.emit('createRoom', { name, roomID: id });
      setRoomID(id);
    } catch (error) {
      console.log('error')
    }
  };

  const joinRoomRequest = (event) => {
    event.preventDefault();
    try {
      const socket = io('http://localhost:8000');
      socketRef.current = socket; // Save the socket instance to the ref
      socket.emit('joinRoom', { name, roomID });
      handleGotoRoom(); // Assuming you want to navigate after joining the room
    } catch (error) {
      console.log('error')
    }
  };

  useEffect (() => {
    if(roomID){
      handleGotoRoom();
    }    
  }, [roomID, handleGotoRoom])

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socketRef.current = socket;
  
    return () => {
      socket.disconnect(); // Disconnect socket when component unmounts
    };
  }, []);

  return (
    <div className="container">
      <form className="form" id="new-room" onSubmit={createRoomRequest}>
        <div className="heading">create room</div>
        <input
          type="text"
          name="name"
          placeholder="enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">create</button>
      </form>
      <form className="form" id="enter-room" onSubmit={joinRoomRequest}>
        <div className="heading">join room</div>
        <input
          type="text"
          name="name"
          placeholder="enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="roomID"
          placeholder="enter room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
        />
        <button type="submit">join</button>
      </form>
    </div>
  );
};

export default Lobby;
