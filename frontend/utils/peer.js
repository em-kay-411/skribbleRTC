function setPeer() {
    const peer = new Peer(undefined, {
        host: '/',
        port: '3001'
    })
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    const myVideoDiv = createVideoDiv(myVideo, 'you');
    const peers = {}

    peer.on('open', userID => {
        socket.emit('join-peer-to-room', ({ roomID, userID }))
    });

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        addVideoStream(myVideoDiv, myVideo, stream)

        peer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video');
            let videoDiv;
            getPeerName(call.peer).then((name) => {
                videoDiv = createVideoDiv(video, name);
            });
            call.on('stream', userVideoStream => {
                addVideoStream(videoDiv, video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            console.log('user connected');
            setTimeout(connectToNewUser, 1000, userId, stream)
        })
    })

    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
    })

    function connectToNewUser(userId, stream) {
        const call = peer.call(userId, stream);
        const video = document.createElement('video');
        let videoDiv;
        getPeerName(call.peer).then((name) => {
            videoDiv = createVideoDiv(video, name);
        });
        call.on('stream', userVideoStream => {
            addVideoStream(videoDiv, video, userVideoStream)
        })
        call.on('close', () => {
            videoDiv.remove()
        })

        peers[userId] = call
    }

    function addVideoStream(videoDiv, video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play();
        })
        videos.append(videoDiv);
        console.log('appended video')
    }
}

