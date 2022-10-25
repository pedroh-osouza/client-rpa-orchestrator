const { ipcRenderer } = require('electron');
const peerConnections = {};
const config = {
    iceServers: [
        { url: 'stun:stun.l.google.com:19302' },
    ]
};

import ws from './Services/Websocket/connection';
var stream

ws.onEvent("answer", (event) => {
    let data = event.request.arguments.data
    peerConnections[data.id].setRemoteDescription(data.description);
});

ipcRenderer.on('watcher', async (event, sourceId, id) => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'screen',
                chromeMediaSourceId: sourceId,
                minWidth: 1000,
                maxWidth: 1000,
                minHeight: 700,
                maxHeight: 700
            }
        }
    });

    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            ws.emit("candidate", { id: id, candidate: event.candidate });
        }
    };

    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            ws.emit("offer", { id: id, description: peerConnection.localDescription });
        });
});

ws.onEvent("candidate", (event) => {
    let data = event.request.arguments.data
    peerConnections[data.id].addIceCandidate(data.candidate);
});

ws.onEvent("disconnectPeer", (event) => {
    let data = event.request.arguments.data
    peerConnections[data.id].close();
    delete peerConnections[data.id];
});

window.onunload = window.onbeforeunload = () => {
    ws.close();
};