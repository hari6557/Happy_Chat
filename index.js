const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server Running");
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnection", () => {
    socket.broadcast.emit("callended");

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit("calluser", { signal: signalData, from, name });

      socket.on("ansercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
      });
    });
  });
});
