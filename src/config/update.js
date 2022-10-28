import { autoUpdater } from 'electron-updater';

export default function setUpdateConfig(tray) {

    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.autoRunAppAfterInstall = true

    autoUpdater.checkForUpdates()

    setInterval(() => {
        autoUpdater.checkForUpdates()
        tray.displayBalloon({ title: 'Checando Atualizações', content: 'Buscando por novas atualizações' })
    }, 60000);

    autoUpdater.on('update-available', () => {
        tray.displayBalloon({ title: 'Atualização Disponível', content: 'Ao terminar o download o programa será atualizado' })
    })

    autoUpdater.on('update-downloaded', () => {
        tray.displayBalloon({ title: 'Atualização Baixada', content: 'O Programa será reiniciado para aplicar a atualização' })
        autoUpdater.quitAndInstall()
    })
}