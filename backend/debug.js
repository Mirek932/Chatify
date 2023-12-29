var app = require("./app.js");

app.io.on('connection', (socket) => {
  debug.log(socket);
});