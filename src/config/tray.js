import { app, Tray, Menu } from 'electron'

export default function initTray(win) {
    var tray = null

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Painel', click: function () {
                if (!win.isVisible()) win.show()
            }
        },
        {
            label: 'Fechar Orquestrador 0019', click: function () {
                app.quit()
            }
        },
    ])

    tray = new Tray(process.cwd() + '/src/icons/icon.png')
    tray.setToolTip('Client Rpa Orchestrator')
    tray.setContextMenu(contextMenu)

    return tray;
}