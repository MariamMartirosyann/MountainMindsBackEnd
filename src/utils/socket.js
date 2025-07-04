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
     //console.log("🔌 A user connected:", socket.id);

  // Step 1: User joins with their ID
  socket.on("userConnected", (userId) => {
   // console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    onlineUsers.set(userId, socket.id);

    // Notify others
    
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      // console.log("🟢 Online users 1:", Array.from(onlineUsers.keys()));
  });
   

    // User is typing event
  socket.on("typing", ({ firstName, lastName,userId, targetUserId }) => {
    const roomId = getSecretRoomId(userId, targetUserId);
    // Notify the other user in the room that this user is typing
    socket.to(roomId).emit("typing", { userId });
    console.log(
      `${firstName +" "+ lastName} is typing in room ${roomId} to user ${targetUserId}`
    );
  });

  socket.on("stopTyping", ({firstName, lastName, userId, targetUserId }) => {
    const roomId = getSecretRoomId(userId, targetUserId);
    socket.to(roomId).emit("stopTyping", { userId });
    console.log(
      `${firstName + lastName} stopped typing in room ${roomId} to user ${targetUserId}`
    );
  });

    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
     // console.log(firstName + " " + lastName + " is started " + roomId);
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
              createdAt: new Date()
            });
          }

         
          chat.messages.push({ senderId: userId, text,  createdAt: new Date(), });
          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text,  createdAt:chat.createdAt });
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
    //console.log("❌ A user disconnected:", socket.id);
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
