import store from "@/config/store";
const { exec } = require("child_process");

export default function start(public_id) {
    let data = store.get('robots')
    let execPath
    for (let robot in data) {
        if (data[robot].public_id == public_id) {
            execPath = data[robot].filename
        }
    }

    let uiRobot = 'C:/Users/' + process.env.USERNAME + '/AppData/Local/Programs/Uipath/Studio'
    let command = 'cd ' + uiRobot + ' && ' + 'UiRobot.exe execute --file ' + execPath
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        //console.log(`stdout: ${stdout}`);
    });
}