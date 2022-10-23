const axios = require('axios').default;
const Store = require('electron-store');
var execSync = require('child_process').execSync;

export default class Publish {
    async status(id) {
        let run = true
        let uipathRunning = false
        const store = new Store({
            watch: true
        })
        try {
            while (run) {
                var processes = execSync('wmic process get description').toString();
                uipathRunning = processes.includes('UiPath.Executor');

                await axios.post(`${process.env.VUE_APP_ROOT_PUB}/status/${id}`, {
                    in_execution: uipathRunning
                })

                store.onDidAnyChange(() => {
                    run = false
                })

                await new Promise(resolve => setTimeout(resolve, 3500));
            }
        } catch (e) {
            console.log(e)
        }
    }
}