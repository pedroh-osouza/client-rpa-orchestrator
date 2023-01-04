import initWebSocket from "@/services/websocket/websocket";
const path = require('path');
const Store = require("electron-store");

const store = new Store({
  watch: true
});

if (!store.has('robots')) store.set('robots', [])

store.onDidAnyChange(() => {
  initWebSocket()
})

export default {
  add(key, item) {
    let data = store.get(key);
    data.push(item);
    store.set(key, data);
  },
  update(){
    let dir, file;
    let data = store.get('robots');
    data.forEach(robot => {
      file = path.basename(robot.filename, path.extname(robot.filename));
      dir = path.dirname(robot.filename)
      console.log(dir, file)
      
    });
  },
  delete(key, index){
    let data = store.get(key);
    data.splice(index, 1);
    store.set(key, data);
  },
  get(key){
    return store.get(key);
  },
  getColumn(key, column){
    let data = store.get(key);
    let value = []
    for(let robot of data){
      value.push(robot[column])
    }
    return value;
  },
};
