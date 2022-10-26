const { ipcRenderer } = require('electron');
const peerConnections = {};
const config = {
    iceServers: [
        { url: 'stun:stun.l.google.com:19302' },
    ]
};

const { hostname } = require('os');
const hostName = hostname()
const ws = require('./websocket')
import ws from './Services/Websocket/connection';

ipcRenderer.on('watcher', async (event, sourceId, idConnection) => {
    var stream = await navigator.mediaDevices.getUserMedia({
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

    ws.onEvent(`answer.${hostName}.${idConnection}`, (event) => {
        console.log('answer')
        let data = event.request.arguments.data;
        peerConnections[data.idConnection].setRemoteDescription(data.description);
    })

    const peerConnection = new RTCPeerConnection(config);
    peerConnections[idConnection] = peerConnection;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            ws.emit(`candidate.${hostName}.${idConnection}`, { idConnection: idConnection, candidate: event.candidate });
        }
    };

    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            ws.emit(`offer.${hostName}.${idConnection}`, { idConnection: idConnection, description: peerConnection.localDescription });
        });

    ws.onEvent(`candidate.${hostName}.${idConnection}`, (event) => {
        let data = event.request.arguments.data;
        peerConnections[data.idConnection].addIceCandidate(new RTCIceCandidate(data.candidate));
    });

});