import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from './routes/message.route.js'
import adminRoutes from './routes/admin.route.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(cors({
    origin: process.env.CLIENT_URL || "https://housin.vercel.app", // Fallback if CLIENT_URL is not set
     withCredentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

// Auth route
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/posts",postRoute)
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use('/api/admin', adminRoutes);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
