const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

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

  // Memory map to track online users: { userId: socketId }
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    //Handle socket events here
     console.log("🔌 A user connected:", socket.id);

  // Step 1: User joins with their ID
  socket.on("userConnected", (userId) => {
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    onlineUsers.set(userId, socket.id);

    // Notify others
    
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
       console.log("🟢 Online users 1:", Array.from(onlineUsers.keys()));
  });
   

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
    console.log("❌ A user disconnected:", socket.id);
    // Remove user by socketId
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
   
  });
};

module.exports = inishializeSocket;
