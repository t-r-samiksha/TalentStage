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

    // USER JOIN / ONLINE
    socket.on(
      "join",
      (userId) => {

        // save mapping
        socketUserMap.set(
          socket.id,
          userId
        );

        // attach user to socket
        socket.userId = userId;

        // join personal room
        socket.join(userId);

        // add online user
        onlineUsers.add(userId);

        // emit full presence update
        io.emit(
          "presence:update",
          Array.from(onlineUsers)
        );

        // emit individual online event
        io.emit(
          "user:online",
          userId
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

        // get user
        const userId =
          socketUserMap.get(socket.id);

        // remove from tracking
        if (userId) {

          onlineUsers.delete(userId);

          socketUserMap.delete(
            socket.id
          );

          // emit updated presence
          io.emit(
            "presence:update",
            Array.from(onlineUsers)
          );

          // emit offline event
          io.emit(
            "user:offline",
            userId
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