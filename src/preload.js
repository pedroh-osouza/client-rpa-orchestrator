import ws from "./Services/Websocket/connection";

const { ipcRenderer } = require("electron");
const peerConnections = {};
const config = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }],
};

function clearPeerConnectionsDisconnecteds() {
  for (let keyConnection in peerConnections) {
    if (peerConnections[keyConnection].iceConnectionState === "disconnected") {
      peerConnections[keyConnection].close();
      delete peerConnections[keyConnection];
    }
  }
}

ipcRenderer.on("watcher", async (event, sourceId, remoteIdConnection) => {

  clearPeerConnectionsDisconnecteds();
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

  const peerConnection = new RTCPeerConnection(config)
  peerConnections[remoteIdConnection] = peerConnection

  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });

  ws.onEvent(`answer.${remoteIdConnection}`, async (event) => {
    console.log('answer')
    let data = event.request.arguments.data;
    if (data.description) {
      const remoteDesc = new RTCSessionDescription(data.description);
      await peerConnections[data.remoteIdConnection].setRemoteDescription(remoteDesc)
    }
  });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  ws.emit(`offer.${remoteIdConnection}`, { remoteIdConnection, description: peerConnection.localDescription })

  peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
      ws.emit(`candidate.${remoteIdConnection}`, { remoteIdConnection, candidate: event.candidate });
    }
  });

  ws.onEvent(`candidate.${remoteIdConnection}`, async (event) => {
    let data = event.request.arguments.data;
    if (data.candidate) {
      try {
        await peerConnections[data.remoteIdConnection].addIceCandidate(data.candidate);
      } catch (e) {
        console.error('erro add ice candidate', e);
      }
    }
  })

  ws.onEvent(`disconnectPeer.${remoteIdConnection}`, () => {
    peerConnections[remoteIdConnection].close();
    delete peerConnections[remoteIdConnection];
  });

});
