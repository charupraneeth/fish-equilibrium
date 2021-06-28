const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const http = require("http");
const { getStateWithCalculatedProfit, findWinner } = require("./utils");
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
      userData: [{ username, userID }],
      day: 1,
      scores: {},
      isChatDisabled: true,
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
    if (rooms[roomCode].userData.length >= 4) {
      console.log("room is full");
      return;
    }
    socket.join(roomCode);
    rooms[roomCode].userData.push({ username, userID: socket.id });
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
    io.to(roomCode).emit("gameStateUpdate", rooms[roomCode]);
  });

  // on chooseFish
  socket.on("chooseFish", (chosenFish) => {
    if (chosenFish != 1 && chosenFish != 2) {
      console.log("invalid fish chosen", chosenFish);
      return;
    }

    const { roomCode } = users[socket.id];
    const { day } = rooms[roomCode];
    if (!rooms[roomCode].scores[day]) {
      rooms[roomCode].scores[day] = {};
    }
    rooms[roomCode].isChatDisabled = true; // disable chat
    rooms[roomCode].scores[day][socket.id] = {
      chosenFish,
      profit: "",
      totalProfit: 0,
    };
    if (Object.keys(rooms[roomCode].scores[day]).length >= 4) {
      // calculate profit for each player
      // if last day -> end game
      rooms[roomCode] = getStateWithCalculatedProfit(rooms[roomCode]);
      if (rooms[roomCode].day == 8) {
        const winnerID = findWinner(rooms[roomCode]);
        console.log(winnerID);
        io.to(roomCode).emit("gameStateUpdate", rooms[roomCode]);
        io.to(roomCode).emit("gameOver", {
          userID: winnerID,
          username: users[winnerID].username,
        });
      } else {
        // other regular days
        rooms[roomCode].day += 1; // day over go to next day
        if (rooms[roomCode].day == 3 || rooms[roomCode].day == 6)
          rooms[roomCode].isChatDisabled = false; // enable chat on 3rd and 6th day
        io.to(roomCode).emit("gameStateUpdate", rooms[roomCode]);
      }
    }
  });

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
      rooms[roomCode].userData = rooms[roomCode].userData.filter(
        (data) => data.userID != socket.id
      );
      rooms[roomCode].scores = {};
      rooms[roomCode].day = 1;
      io.to(roomCode).emit("message", {
        text: `${username} left`,
        from: null,
        type: "left",
      });

      io.to(roomCode).emit("gameStateUpdate", rooms[roomCode]);
    }

    // io.emit("disconnection", { id: socket.id });
  });
});

server.listen(port, () => console.log(`app running of port ${port}`));
