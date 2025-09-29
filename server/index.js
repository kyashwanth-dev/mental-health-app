const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.send("Chat server is running");
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatclient-kh67.onrender.com"],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
