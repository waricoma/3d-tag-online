'use strict';

const viewer = document.getElementById('viewer');

/**
 * @type {string}
 */
const peerId = location.search.replace('?peer_id=', '');

const peer = new Peer({
  key: 'skyway-api-key',
  debug: 3
});

peer.on('open', () => {
  console.log(`peer.id: ${peer.id}`);

  const connection = peer.connect(peerId);

  connection.on('open', () => {
    document.onkeydown = (e) => {
      keyEvToArrOfCtrlStatus('down', e.code);
      connection.send(ctrlStatus);
    };

    document.onkeyup = (e) => {
      keyEvToArrOfCtrlStatus('up', e.code);
      connection.send(ctrlStatus);
    };
  });

  connection.on('data', (imgData) => {
    const bytes = new Uint8Array(imgData);

    let binaryData = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryData += String.fromCharCode(bytes[i]);
    }

    viewer.src = "data:image/png;base64," + window.btoa(binaryData);
  });
});

peer.on('error', (err) => {
  throw new Error(err);
});

/**
 * ctrlStatus
 *
 * value
 * 0: up
 * 1: down
 *
 * index
 * 0: ArrowUp
 * 1: ArrowDown
 * 2: ArrowLeft
 * 3: ArrowRight
 * 4: Space
 * 5: ShiftLeft
 *
 * @returns {number[]}
 */
let ctrlStatus = [0, 0, 0, 0, 0, 0];

const keyToIndexOfCtrlStatus = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft'];

/**
 * keyEvToArrOfCtrlStatus
 *
 * @param {'up' | 'down'} upOrDown
 * @param {string} key
 * @returns {number[]}
 */
const keyEvToArrOfCtrlStatus = (upOrDown, key) => {
  ctrlStatus[keyToIndexOfCtrlStatus.indexOf(key)] = (upOrDown === 'up') ? 0 : 1;
};
