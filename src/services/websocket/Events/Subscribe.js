import emitNotification from '@/config/notification';
import ws from '../connection';
import start from '../triggers/start';
import stop from '../triggers/stop';

export default class Subscribe {
    eventStart(public_id) {
        ws.onEvent(`start.${public_id}`, () => {
            start(public_id)
            emitNotification('Robô Iniciado', `O Robô ${public_id} foi iniciado`)
        })
    }

    eventStop(public_id) {
        ws.onEvent(`stop.${public_id}`, () =>{
            stop()
            emitNotification('Robô Finalizado', `O Robô ${public_id} foi finalizado`)
        })
    }
}