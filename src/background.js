import { app, BrowserWindow, desktopCapturer, protocol } from 'electron';
import { hostname } from 'os';
import ws from './services/websocket/connection';
import initWebSocket from './services/websocket/websocket';
import initTray from './config/tray';
import setStartWithWindows from './config/startup';
import setUpdateConfig from './config/update';
import createWindow from './config/window';

require('events').EventEmitter.prototype._maxListeners = 1000;
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const isDevelopment = process.env.NODE_ENV !== 'production';
const electron = require('electron')
const dialog = electron.dialog

dialog.showErrorBox = function(title, content) {
  console.log(`${title}\n${content}`);
};

app.setAppUserModelId('Client Rpa Orchestrator');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
});

app.on('ready', async () => {
  let win = await createWindow()
  
  initWebSocket()
  setUpdateConfig()
  initTray(win)
  
  if (!isDevelopment) setStartWithWindows()

  ws.onEvent(`watcher.${hostname()}`, (event) => {
    let data = event.request.arguments.data;
    console.log('watcher')
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
      win.webContents.send('watcher', sources[0].id, data.remoteIdConnection)
    })
  });

  setInterval(() => {
    app.relaunch()
    app.quit()
  }, 3600000);

})