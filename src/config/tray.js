import { app, Tray, Menu } from 'electron'
var tray = null;

export default function initTray(win) {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Painel', click: function () {
                if (!win.isVisible()) win.show()
            }
        },
        {
            label: 'Fechar Orquestrador', click: function () {
                app.quit()
            }
        },
    ]);

    tray = new Tray(process.cwd() + '/src/icons/icon.png');
    tray.setToolTip('Client Rpa Orchestrator');
    tray.setContextMenu(contextMenu);
}