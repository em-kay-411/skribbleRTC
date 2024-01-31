function setPeer() {
    const peer = new Peer(undefined, {
        host: '/',
        port: '3001'
    })
    const myVideo = document.createElement('video')
    myVideo.muted = true
    const peers = {}

    peer.on('open', userID => {
        socket.emit('join-peer-to-room', ({ roomID, userID }))
    });

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        addVideoStream(myVideo, stream)

        peer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
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
        const call = peer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }

    function addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play();
        })
        videos.append(video);
        console.log('appended video')
    }
}

