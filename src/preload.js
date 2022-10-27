const { ipcRenderer } = require("electron");
const peerConnections = {};
const config = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }],
};

import ws from "./Services/Websocket/connection";

ipcRenderer.on("watcher", async (event, sourceId, remoteIdConnection) => {

  var stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "screen",
        chromeMediaSourceId: sourceId,
        minWidth: 1000,
        maxWidth: 1000,
        minHeight: 700,
        maxHeight: 700,
      },
    },
  });

  ws.onEvent(`answer.${remoteIdConnection}`, event => {
    console.log("answer");
    let data = event.request.arguments.data;
    peerConnections[data.remoteIdConnection].setRemoteDescription(data.description);
  });

  const peerConnection = new RTCPeerConnection(config);
  peerConnections[remoteIdConnection] = peerConnection;
  console.log('peerConnections',peerConnections)

  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      ws.emit(`candidate.${remoteIdConnection}`, {
        remoteIdConnection,
        candidate: event.candidate,
      });
    }
  };

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      ws.emit(`offer.${remoteIdConnection}`, {
        remoteIdConnection,
        description: peerConnection.localDescription,
      });
    });

  ws.onEvent(`candidate.${remoteIdConnection}`, event => {
    let data = event.request.arguments.data;
    peerConnections[data.remoteIdConnection].addIceCandidate(
      new RTCIceCandidate(data.candidate)
    );
  });

  console.log('onEvent', `disconnectPeer.${remoteIdConnection}`)
  ws.onEvent(`disconnectPeer.${remoteIdConnection}`, (event) => {
      let data = event.request.arguments.data;
      if(!(data.remoteIdConnection in peerConnections)) return;
      peerConnections[data.remoteIdConnection].close();
      delete peerConnections[data.remoteIdConnection];
      console.log('disconnectPeer',peerConnections)
  })
});
