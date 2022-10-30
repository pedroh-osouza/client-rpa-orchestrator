import { Notification } from "electron"

export default function emitNotification(title, message){
    new Notification({title: title, body: message, icon: process.cwd() + '/src/icons/icon.png'}).show()
}