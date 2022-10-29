import ws from '../connection';
import start from '../triggers/start';
import stop from '../triggers/stop';

export default class Subscribe {
    eventStart(public_id) {
        ws.onEvent(`start.${public_id}`, () => {
            start(public_id)
        })
    }

    eventStop(public_id) {
        ws.onEvent(`stop.${public_id}`, () =>{
            stop()
        })
    }
}