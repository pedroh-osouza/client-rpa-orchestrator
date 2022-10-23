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

require('events').EventEmitter.prototype._maxListeners = 1000;
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const hostName = hostname();
var tray = null
const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Open GUI', click: function () {
      if (!win.isVisible()) win.show()
    }
  },
  {
    label: 'Quit', click: function () {
      app.quit()
    }
  },
])
var win = null

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Client Rpa Orchestrator',
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  //win.webContents.openDevTools()

  tray = new Tray(process.cwd() + '/src/icons/icon.png')
  tray.setToolTip('Client RPA Orchestrator')
  tray.setContextMenu(contextMenu)

  win.on('close', function (event) {
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
    autoUpdater.checkForUpdatesAndNotify()
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
  initDatabase()
  createWindow()
  initWebSocket()
  const store = new Store({
    watch: true
  })

  store.onDidAnyChange(() => {
    initWebSocket()
  })
})

if (!isDevelopment) {
  fs.copyFile(`${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Client Rpa Orchestrator.lnk`,
    `${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Startup/Client Rpa Orchestrator.lnk`, (err) => {})
}

function initDatabase() {
  const store = new Store({
    watch: true
  });
  if (!store.has('robots')) store.set('robots', [])
}

ws.onEvent('watcher', (event) => {
  let data = event.request.arguments.data;
  if (!data.id == hostName) return;
  console.log('watcher')
  desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    win.webContents.send('watcher', sources[0].id, hostName)
  })
});