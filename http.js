const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("hello world");
    res.end();
  } else {
      res.write("hello duniya");
      res.end();
  }
});
server.listen(3000);
console.log("lisasdfasdf", server);
