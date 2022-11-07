import logs from "@/config/logs";

/* eslint-disable */
const axios = require("axios").default;
const { app } = require("electron");
var execSync = require("child_process").execSync;

export default class Publish {
  async status(id) {
    let uipathRunning = false;

    while (true) {
      try {
        var processes = execSync("wmic process get description").toString();
        uipathRunning = processes.includes("UiPath.Executor");

        await axios.post(`${process.env.VUE_APP_ROOT_PUB}/status/${id}`, {
          in_execution: uipathRunning,
        });

        await new Promise((resolve) => setTimeout(resolve, 3500));
      } catch (e) {
        logs.error('status error ' + e)
        app.relaunch()
        app.quit()
      }
    }
  }
}
