import ws from "./Services/Websocket/connection";

const { ipcRenderer } = require("electron");
const peerConnections = {};
const config = {
  iceServers: [{ url: process.env.VUE_APP_ROOT_STUN }],
};

function clearPeerConnectionsDisconnecteds(){
  for(let keyConnection in peerConnections ){
    if(peerConnections[keyConnection].iceConnectionState === 'disconnected'){
      peerConnections[keyConnection].close()
      delete peerConnections[keyConnection];
    }
  }
}

ipcRenderer.on("watcher", async (event, sourceId, remoteIdConnection) => {
  var stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "screen",
        chromeMediaSourceId: sourceId,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
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
  clearPeerConnectionsDisconnecteds()
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
});
