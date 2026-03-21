import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  socket = io(
    import.meta.env.MODE === "development" ? "http://localhost:8000" : "/",
    {
      query: {
        userId,
      },
    }
  );

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
