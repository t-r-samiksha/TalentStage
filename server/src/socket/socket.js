import { Server } from "socket.io";

let io;

// online users
const onlineUsers = new Set();

// socketId -> userId
const socketUserMap = new Map();

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "User connected:",
      socket.id
    );

    // USER JOIN
    socket.on(
      "join",
      (userId) => {

        // save mapping
        socketUserMap.set(
          socket.id,
          userId
        );

        // join personal room
        socket.join(userId);

        // add online user
        onlineUsers.add(userId);

        // emit updated presence
        io.emit(
          "presence:update",
          Array.from(onlineUsers)
        );

        console.log(
          `User joined room: ${userId}`
        );

      }
    );

    // CONTRACT ROOM JOIN
    socket.on(
      "join_contract",
      (contractId) => {

        socket.join(contractId);

        console.log(
          `Joined contract room: ${contractId}`
        );

      }
    );

    // TYPING START
    socket.on(
      "typing:start",
      ({ contractId, userId }) => {

        socket.to(contractId).emit(
          "typing:start",
          userId
        );

      }
    );

    // TYPING STOP
    socket.on(
      "typing:stop",
      ({ contractId, userId }) => {

        socket.to(contractId).emit(
          "typing:stop",
          userId
        );

      }
    );

    // READ RECEIPT
    socket.on(
      "message:read",
      ({ contractId, messageId }) => {

        socket.to(contractId).emit(
          "message:read",
          messageId
        );

      }
    );

    // DISCONNECT
    socket.on(
      "disconnect",
      () => {

        console.log(
          "User disconnected:",
          socket.id
        );

        // get actual user
        const userId =
          socketUserMap.get(socket.id);

        // remove user
        if (userId) {

          onlineUsers.delete(userId);

          socketUserMap.delete(
            socket.id
          );

          // update presence
          io.emit(
            "presence:update",
            Array.from(onlineUsers)
          );

        }

      }
    );

  });

};

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;

};