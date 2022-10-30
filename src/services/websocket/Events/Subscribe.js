import initTray from '@/config/tray';
import ws from '../connection';
import start from '../triggers/start';
import stop from '../triggers/stop';

export default class Subscribe {
    eventStart(public_id) {
        ws.onEvent(`start.${public_id}`, () => {
            start(public_id)
            let tray = initTray()
            tray.displayBalloon({ title: 'Robô Iniciado', content: `O Robô ${public_id} foi iniciado` })
        })
    }

    eventStop(public_id) {
        ws.onEvent(`stop.${public_id}`, () =>{
            stop()
            let tray = initTray()
            tray.displayBalloon({ title: 'Robô Finalizado', content: `O Robô ${public_id} foi finalizado` })
        })
    }
}