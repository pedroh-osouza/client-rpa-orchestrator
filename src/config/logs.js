const log = require('electron-log');

export default {
    info(message) {
        log.info(message)
    },
    warn(message) {
        log.warn(message)
    },
    error(message){
        log.error(message)
    }
}