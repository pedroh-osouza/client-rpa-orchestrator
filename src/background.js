import { app, protocol, BrowserWindow, desktopCapturer } from 'electron'
// import { autoUpdater } from 'electron-updater';
import { hostname } from 'os';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import ws from './Services/Websocket/connection';
import initWebSocket from './Services/Websocket/websocket';
import initTray from './config/tray'
import startWithWindows from './config/windowsStartUp';
import path from 'path'
import setUpdateConfig from './config/update';

// autoUpdater.autoDownload = true
// autoUpdater.autoInstallOnAppQuit = true
// autoUpdater.autoRunAppAfterInstall = true

require('events').EventEmitter.prototype._maxListeners = 1000;
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const isDevelopment = process.env.NODE_ENV !== 'production'
if (!isDevelopment) {
  startWithWindows()
}

var tray = null
var win = null;
// var updateInterval = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.on('close', function () {
    win = null
  })

  win.on('minimize', function (event) {
    event.preventDefault()
    win.hide()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray.destroy()
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  initWebSocket()
  createWindow()
  tray = initTray(win)
  setUpdateConfig(tray)
  
  // autoUpdater.checkForUpdates()

  // updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 3000);

  // autoUpdater.on('update-available', () => {
  //   tray.displayBalloon({ title: 'Atualização Disponível', content: 'Ao terminar o download o programa será atualizado' })
  // })

  // autoUpdater.on('update-downloaded', () => {
  //   tray.displayBalloon({ title: 'Atualização Baixada', content: 'O Programa será reiniciado para aplicar a atualização' })
  //   autoUpdater.quitAndInstall()
  // })

  ws.onEvent(`watcher.${hostname()}`, (event) => {
    let data = event.request.arguments.data;
    console.log('watcher')
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
      win.webContents.send('watcher', sources[0].id, data.remoteIdConnection)
    })
  });
})

const Store = require("electron-store");

const store = new Store({
  watch: true
});

store.onDidAnyChange(()=>{
  initWebSocket()
})