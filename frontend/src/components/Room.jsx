import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Peer } from 'peerjs'
import { useNavigate } from 'react-router-dom';

const Room = ({ roomId }) => {
  const videoGrid = useRef();
  const myPeer = useRef();
  const myVideo = useRef();
  const peers = useRef({});
  const socket = io('http://localhost:8000');
  const navigate = useNavigate();

  useEffect((socket) => {
    myPeer.current = new Peer(undefined, {
      host: '/',
      port: '3001'
    });

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      addVideoStream(myVideo.current, stream);

      myPeer.current.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
      });
    });

    socket.on('user-disconnected', userId => {
      if (peers.current[userId]) peers.current[userId].close();
    });

    myPeer.current.on('open', id => {
      socket.emit('join-room', roomId, id);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, socket]);

  function connectToNewUser(userId, stream) {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    peers.current[userId] = call;
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.current.append(video);
  }

  return (
    <div>
      <div ref={videoGrid}></div>
    </div>
  );
};

export default Room;
