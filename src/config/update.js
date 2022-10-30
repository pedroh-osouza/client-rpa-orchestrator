import { autoUpdater } from 'electron-updater';
import emitNotification from './notification';

export default function setUpdateConfig() {

    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.autoRunAppAfterInstall = true

    autoUpdater.checkForUpdates()

    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000);

    autoUpdater.on('update-available', () => {
        emitNotification('Atualização Disponível','Ao terminar o download o programa será atualizado' )
    })

    autoUpdater.on('update-downloaded', () => {
        emitNotification('Atualização Baixada', 'O Programa será reiniciado para aplicar a atualização')
        autoUpdater.quitAndInstall()
    })
}