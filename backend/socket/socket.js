import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// this map will hold user id as key and socket id as value, userId -> socketId
// online users socketId will be stored here
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  console.log(`User connected: userId: ${userId}, socketId: ${socket.id}`);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(
        `User disConnected: userId: ${userId}, socketId: ${socket.id}`
      );
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io, app };
