import ws from '../connection';
import start from '../Triggers/start';
import stop from '../Triggers/stop';

export default class Subscribe {

    eventStart(public_id) {
        ws.onEvent(`start.${public_id}`, (event) => {
            start(public_id)
        })
    }

    eventStop(public_id) {
        ws.onEvent(`stop.${public_id}`, (event) =>{
            stop(public_id)
        })
    }
}