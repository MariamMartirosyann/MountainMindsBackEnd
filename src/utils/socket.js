const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const { Connection } = require("mongoose");
const { stat } = require("fs");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const inishializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //Handle socket events here

    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " " + lastName + " is started " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          //Save Messages to database
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
          console.log(
            firstName +
              " " +
              lastName +
              " is sent " +
              roomId +
              " the message is " +
              text
          );
        } catch (err) {
          console.log(err.message);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};

module.exports = inishializeSocket;
