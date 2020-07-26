const EventsEmitter = require("events");

const Logger = require('./logger')
var logger = new Logger(); 


// listen  
logger.on("skvTest", args => {
    console.log("this is what actually passed" , args)
})

logger.log("Syam is sending the message")