import logs from "@/config/logs";

const axios = require("axios").default;
const { app } = require("electron");
var execSync = require("child_process").execSync;

export default class Publish {

  async status(id) {

    setInterval( async () => {
      let uipathRunning = false;
      try {
        var processes = execSync("wmic process get description").toString();
        uipathRunning = processes.includes("UiPath.Executor");

        await axios.post(`https://socket.viacometa.com.br/orchestrator/status/${id}`, {
          in_execution: uipathRunning,
        });

      } catch (e) {
        app.relaunch()
        logs.error('status error ' + e)
        app.quit()
      }   
    }, 3500);

    // while (true) {
    //   try {
    //     var processes = execSync("wmic process get description").toString();
    //     uipathRunning = processes.includes("UiPath.Executor");

    //     await axios.post(`https://socket.viacometa.com.br/orchestrator/status/${id}`, {
    //       in_execution: uipathRunning,
    //     });

    //     await new Promise((resolve) => setTimeout(resolve, 3500));
    //   } catch (e) {
    //     logs.error('status error ' + e)
    //     app.relaunch()
    //     app.quit()
    //   }
    // }
  }
}
