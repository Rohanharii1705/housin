//socket/app.js
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin:  ["https://housin.vercel.app", "https://housin-backend.onrender.com"], // Allow both origins
    methods: ["GET", "POST"],
    credentials: true // Allow cookies to be sent
  },
});

let onlineUser = []; // To store user ids

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
});


  socket.on("sendMessage", ({ receiverId, data }) => {
    console.log(`Sending message to ${receiverId}:`, data);
    const receiver = getUser(receiverId);
    if (receiver) {
        io.to(receiver.socketId).emit("getMessage", data);
        console.log(`Message sent to ${receiverId}`);
    } else {
        console.log(`User ${receiverId} not connected.`);
    }
});

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(4000, () => {
  console.log("Socket.IO server is running on port 4000");
});
