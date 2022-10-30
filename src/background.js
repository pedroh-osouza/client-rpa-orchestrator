import { app, BrowserWindow, desktopCapturer } from 'electron'
import { hostname } from 'os';
import ws from './services/websocket/connection';
import initWebSocket from './services/websocket/websocket';
import initTray from './config/tray'
import startWithWindows from './config/startup';
import setUpdateConfig from './config/update';
import createWindow from './config/window';

require('events').EventEmitter.prototype._maxListeners = 1000;
const isDevelopment = process.env.NODE_ENV !== 'production'

var tray = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray.destroy()
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

app.on('ready', async () => {
  initWebSocket()
  setUpdateConfig()
  let win = await createWindow()
  tray = initTray(win)

  if (!isDevelopment) startWithWindows()
  if (process.platform === 'win32') app.setAppUserModelId('Client Rpa Orchestrator');

  ws.onEvent(`watcher.${hostname()}`, (event) => {
    let data = event.request.arguments.data;
    console.log('watcher')
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
      win.webContents.send('watcher', sources[0].id, data.remoteIdConnection)
    })
  });
})