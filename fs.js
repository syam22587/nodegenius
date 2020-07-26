const fs = require("fs");

console.log(
  fs.readdir(".d/", (err, res) => {
    if (err) {
      console.log("errror", err);
    } else {
      console.log("result", res);
    }
  })
);
