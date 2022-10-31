/* eslint-disable */
const axios = require('axios').default;
var execSync = require('child_process').execSync;

export default class Publish {
    async status(id) {
        let uipathRunning = false
        try {
            while (true) {
                var processes = execSync('wmic process get description').toString();
                uipathRunning = processes.includes('UiPath.Executor');

                await axios.post(`${process.env.VUE_APP_ROOT_PUB}/status/${id}`, {
                    in_execution: uipathRunning
                })

                await new Promise(resolve => setTimeout(resolve, 3500));
            }
        } catch (e) {
            console.log('status error:', e)
        }
    }
}