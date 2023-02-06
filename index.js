const { time } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var sockets = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  if (socket.handshake.query.deviceId) {
    sockets.set(socket.handshake.query.deviceId, socket);
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("METHOD_ON_CHANGE_POSE", (data) => {
    // show data and current time on console.log
    console.log(data + " " + new Date().toLocaleTimeString());
  });

  socket.on("test", (data) => {
    console.log(data);
    socket.emit("test", data);
  });
  socket.on("MINI_DEVICE_ID", (data) => {
    console.log(data);
    if (sockets.has("MINI_DEVICE_ID")) {
      sockets.get("MINI_DEVICE_ID").emit("command", data);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
