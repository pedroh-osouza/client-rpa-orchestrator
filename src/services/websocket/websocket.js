import store from "@/config/store";
import Publish from "./Events/Publish";
import Subscribe from "./Events/Subscribe";

export default function initWebSocket(){
    let ids = store.getColumn('robots','public_id');
    const publish = new Publish()
    const subscribe = new Subscribe()
    
    for(let id of ids){
        publish.status(id)
        subscribe.eventStart(id)
        subscribe.eventStop(id)
    }
}