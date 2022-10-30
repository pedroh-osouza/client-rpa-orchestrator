import { app, shell } from 'electron'

export default function setStartWithWindows() {
    shell.writeShortcutLink(`${app.getPath('appData')}/Microsoft/Windows/Start Menu/Programs/Startup/Client Rpa Orchestrator.lnk`,{target: app.getPath('exe')})
}