import { Server } from "socket.io";
import { ENV } from "../config/env.js";
const userSocketMap = {};

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [ENV.FRONTEND_URL, "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected to the server", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log("A user disconnected from the server", userId);
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
