'use strict';

const { app, BrowserWindow, session, ipcMain } = require('electron');

const imagesPath = '../3d-tag/Assets/images/';
const chokidar = require('chokidar');
const watcher = chokidar.watch(imagesPath, {
  ignored: /[\/\\]\./,
  persistent: true
});

const fs = require('fs');
const fp = require('find-free-port');
const http = require('http');
const ngrok = require('ngrok');

const file = require('node-static');
const publicUI = new file.Server(`${__dirname}/public`);

let win = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = '3d-tag://3d-tag';
    callback({
      cancel: false,
      requestHeaders: details.requestHeaders
    });
  });

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setTitle(require('./package.json').name);
  win.loadURL(`file://${__dirname}/ui/index.html`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });

  watcher.on('ready', () => {
    watcher.on('change', (/* path */) => {
      fs.readFile(imagesPath + 'screenshot.png', (err, imgData) => {
        if (err) {
          throw new Error(err);
        }

        win.webContents.send('imgData', imgData);
      });
    });
  });
});

fp(3000, 9000, (err, freePort) => {
  if (err) {
    throw new Error(err);
  }

  http.createServer((req, res) => {
    req.addListener('end', () => {
      publicUI.serve(req, res);
    }).resume();
  }).listen(freePort, 'localhost', async () => {
    const preparedNgrokUrl = await ngrok.connect(freePort);
    win.webContents.send('preparedNgrok', preparedNgrokUrl);
  });
});

ipcMain.on('receivedDataFromWebRTC', (event, data) => {
  fs.writeFile('../3d-tag/Assets/enemy-status.csv', data.join(','), (err) => {
    if (err) {
      throw new Error(err);
    }
  });
});
