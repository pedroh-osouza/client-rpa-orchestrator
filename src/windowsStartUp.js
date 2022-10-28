import { app } from 'electron'
const fs = require('fs')

export default function startWithWindows() {
    fs.copyFile(`${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Client Rpa Orchestrator.lnk`,
        `${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Startup/Client Rpa Orchestrator.lnk`, (err) => { console.log(err) })
}