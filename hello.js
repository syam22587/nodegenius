const loggerX = require("./logger");
function example(a) {
    loggerX(a);
    console.log(__filename , __dirname)
    console.log(module)
}

example("syam");
