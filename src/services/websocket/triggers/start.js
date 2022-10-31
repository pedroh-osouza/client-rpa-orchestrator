import logs from "@/config/logs";
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
            console.log(`start error: ${error.message}`);
            logs.error(`Erro na execução do robô ${public_id}, ${error.message}`)
            return;
        }
        if (stderr) {
            console.log(`start stderr: ${stderr}`);
            logs.error(`Erro na execução do robô ${public_id}, ${stderr}`)
            return;
        }
        logs.info(`Robô ${public_id} executado, ${stdout}`)
    });
}