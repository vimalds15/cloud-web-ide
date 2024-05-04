const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const cors = require("cors");
const pty = require("node-pty");

const ptyProcess = pty.spawn("/bin/bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD,
  env: process.env,
});


const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

app.use(cors());

io.attach(server);

ptyProcess.onData((data) => {
  console.log(data);
  io.emit("terminal:data", data);
});


io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("terminal:write", (data) => {
    console.log(data)
    ptyProcess.write(data);
  });
});

server.listen(9000, () => {
  console.log("🐳 Docker server running on PORT", 9000);
});
