import { app, BrowserWindow, desktopCapturer } from 'electron';
import { hostname } from 'os';
import ws from './services/websocket/connection';
import initWebSocket from './services/websocket/websocket';
import initTray from './config/tray';
import setStartWithWindows from './config/startup';
import setUpdateConfig from './config/update';
import createWindow from './config/window';

const isDevelopment = process.env.NODE_ENV !== 'production';
var tray = null;

app.setAppUserModelId('Client Rpa Orchestrator');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray.destroy()
    app.quit()
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
});

app.on('ready', async () => {
  initWebSocket()
  setUpdateConfig()
  let win = await createWindow()
  tray = initTray(win)

  if (!isDevelopment) setStartWithWindows()

  ws.onEvent(`watcher.${hostname()}`, (event) => {
    let data = event.request.arguments.data;
    console.log('watcher')
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
      win.webContents.send('watcher', sources[0].id, data.remoteIdConnection)
    })
  });
})