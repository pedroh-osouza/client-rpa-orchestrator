'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, desktopCapturer } from 'electron'
import { autoUpdater } from 'electron-updater';
import { hostname } from 'os';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import ws from './Services/Websocket/connection';
import initWebSocket from './Services/Websocket/websocket';

const Store = require('electron-store');
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const fs = require('fs')
const hostName = hostname();
const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Abrir painel', click: function () {
      if (!win.isVisible()) win.show()
    }
  },
  {
    label: 'Fechar orquestrador', click: function () {
      app.quit()
    }
  },
])

require('events').EventEmitter.prototype._maxListeners = 1000;
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

if (!isDevelopment) {
  fs.copyFile(`${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Client Rpa Orchestrator.lnk`,
    `${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Startup/Client Rpa Orchestrator.lnk`, (err) => { console.log(err) })
}

var tray = null;
var win = null;
var updateInterval = null;

function initDatabase() {
  const store = new Store({
    watch: true
  });
  if (!store.has('robots')) store.set('robots', [])
}

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
  
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.autoRunAppAfterInstall = true

  tray = new Tray(process.cwd() + '/src/icons/icon.png')
  tray.setToolTip('Client Rpa Orchestrator')
  tray.setContextMenu(contextMenu)
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
  initDatabase()
  initWebSocket()
  createWindow()
  autoUpdater.checkForUpdates()
  
  const store = new Store({
    watch: true
  })
  store.onDidAnyChange(() => {
    initWebSocket()
  })
  
  updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 3000);

  autoUpdater.on('update-available', () => {
    tray.displayBalloon({ title: 'Atualização Disponível', content: 'Ao terminar o download o programa será atualizado' })
  })

  autoUpdater.on('update-downloaded', () => {
    tray.displayBalloon({ title: 'Atualização Baixada', content: 'O Programa será reiniciado para aplicar a atualização' })
    autoUpdater.quitAndInstall()
  })

  ws.onEvent('watcher', (event) => {
    let data = event.request.arguments.data;
    if (!data.id == hostName) return;
    console.log('watcher')
    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
      win.webContents.send('watcher', sources[0].id, hostName)
    })
  });

})