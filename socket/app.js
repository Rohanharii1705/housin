import { Server } from "socket.io";

// Initialize Socket.IO server with CORS configuration
const io = new Server({
  cors: {
    origin: ["https://housin.vercel.app", "https://housin-backend.onrender.com"], // Allowed origins
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials for cookies
  },
});

let onlineUser = []; // To store online users

// Add a user to the online user list
const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

// Remove a user from the online user list by socket ID
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

// Get a user by user ID
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// Event listeners for Socket.IO
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Add a new user when they connect
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  // Handle message sending
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

  // Handle user disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${reason}`);
    removeUser(socket.id);
  });

  // Error handling
  socket.on("error", (err) => {
    console.error(`Socket error for ${socket.id}:`, err);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
