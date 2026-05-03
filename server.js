const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {

  console.log("User Connected");

  // Send previous messages
  socket.emit("chat-history", messages);

  // Receive message
  socket.on("send-message", (data) => {

    messages.push(data);

    // Broadcast message to everyone
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});