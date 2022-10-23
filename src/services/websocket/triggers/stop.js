const { exec } = require("child_process");

export default function stop(public_id){
    let command = "taskkill /F /IM UiPath.Executor.exe && taskkill /F /IM UiPath.Service.UserHost.exe && taskkill /F /IM UiRobot.exe"
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