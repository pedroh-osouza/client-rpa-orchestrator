import open from "./open";
import closeApp from "./closeApp";
import { Menu } from "electron";

export default {
  create(win, app) {
    return Menu.buildFromTemplate([
        open.menu(win, app), 
        closeApp.menu(win, app)
    ]);
  },
};
