'use strict';

const { ipcRenderer } = require('electron');

let ngrokUrl = ''; // for storing global val
let peerId = ''; // for storing global val

const generateSharingUrl = (ngrokUrl, peerId) => {
  if (ngrokUrl === '' || peerId === '') {
    return;
  }

  document.getElementById('sharingUrl').value = `${ngrokUrl}?peer_id=${peerId}`;
};

ipcRenderer.on('preparedNgrok', (event, preparedNgrokUrl) => {
  console.log(`preparedNgrokUrl: ${preparedNgrokUrl}`);
  ngrokUrl = preparedNgrokUrl;
  generateSharingUrl(ngrokUrl, peerId);
});

const peer = new Peer({
  key: 'skyway-api-key',
  debug: 3
});

peer.on('open', () => {
  console.log(`peer.id: ${peer.id}`);
  peerId = peer.id;
  generateSharingUrl(ngrokUrl, peerId);
});

peer.on('error', (err) => {
  throw new Error(err);
});

let conn;
let connecting = false;

peer.on('connection', (connection) => {
  connection.on('open', () => {
    conn = connection;

    console.log(`connection.id: ${conn.id}`);
    connecting = true;

    ipcRenderer.on('imgData', (event, imgData) => {
      if (!connecting) {
        return;
      }

      try {
        conn.send(imgData);
      } catch (err) {
        if (err.toString() !== 'Error: Connection is not open. You should listen for the `open` event before sending messages.') {
          throw new Error(err);
        }

        connecting = false;
      }
    });
  });

  connection.on('data', (data) => {
    ipcRenderer.send('receivedDataFromWebRTC', data);
  });
});
