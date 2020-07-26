const EventsEmitter = require("events");

class Logger extends EventsEmitter {
  log(params) {
    console.log("params is called ", params);
    this.emit("skvTest", { id: "101" });
  }
}

module.exports = Logger; 