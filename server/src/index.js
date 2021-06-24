const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    allow: "*",
  },
});
const port = process.env.PORT || 1337;
const users = {};
const rooms = {};

io.on("connection", async (socket) => {
  const userID = socket.id;
  console.log("socket connected: ", socket.id);

  // room creation
  socket.on("createRoom", (username) => {
    console.log(username);
    const roomCode = "" + nanoid(8);
    socket.join(roomCode);
    rooms[roomCode] = {
      users: [userID],
      day: 1,
      scores: [],
    };
    users[userID] = {
      username,
      roomCode,
    };
    console.log(`${username} : ${userID} joined ${roomCode}`);
    io.to(userID).emit("roomJoined", roomCode);
    io.to(roomCode).emit("message", {
      from: `${username} joined`,
      text: null,
    });
  });

  // on joining the room
  socket.on("joinRoom", ({ username, roomCode }) => {
    if (!rooms[roomCode]) {
      console.log("room doesnt exist");
      return;
    }
    if (rooms[roomCode].users.length > 4) {
      console.log("room is full");
      return;
    }
    socket.join(roomCode);
    rooms[roomCode].users.push(userID);
    users[userID] = {
      username,
      roomCode,
    };
    console.log(`${username} : ${userID} joined ${roomCode}`);
    io.to(userID).emit("roomJoined", roomCode);
    io.to(roomCode).emit("message", {
      text: `${username} joined`,
      from: null,
      type: "joined",
    });
    const { day, scores, users: userIDs } = rooms[roomCode];
    const userNames = userIDs.map((id) => users[id].username);
    io.to(roomCode).emit("gameStateUpdate", { day, scores, userNames });
  });

  // on chooseFish

  // on new message
  socket.on("sendMessage", (message) => {
    io.to(users[socket.id].roomCode).emit("message", {
      text: message,
      from: users[socket.id].username,
      type: "regular",
    });
  });

  // on disconnection
  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);

    const roomCode = users[socket.id]?.roomCode;
    if (roomCode) {
      const { username } = users[socket.id];
      delete users[socket.id];
      rooms[roomCode].users = rooms[roomCode].users.filter(
        (id) => id != socket.id
      );
      io.to(roomCode).emit("message", {
        text: `${username} left`,
        from: null,
        type: "left",
      });
    }
    io.emit("disconnection", { id: socket.id });
  });
});

server.listen(port, () => console.log(`app running of port ${port}`));
