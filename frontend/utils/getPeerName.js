function getPeerName(peerID) {
    return new Promise((resolve, reject) => {
        socket.emit('get-peer-name', peerID);

        socket.on('peer-name', (name) => {
            console.log('peer-name', name);
            resolve(name);
        });
    });
}