import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Registration controller
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            },
        });

        res.status(201).json({ message: "User created successfully", userId: newUser.id });
    } catch (err) {
        console.error("Registration Error:", err);
        if (err.code === "P2002") {
            // Prisma-specific error for unique constraint violation
            res.status(400).json({ message: "Username or email already exists" });
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    }
};

// Login controller
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ message: "Invalid Credentials" });

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials" });

        // Token expiry duration (7 days)
        const tokenExpiry = "7d";

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin }, // Include `isAdmin` if needed
            process.env.JWT_SECRET_KEY || "fallbackSecret", // Use a fallback for debugging
            { expiresIn: tokenExpiry }
        );

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
            secure: process.env.NODE_ENV === "production", // Set true in production
            sameSite: "strict", // Prevent CSRF attacks
        });

        // Exclude sensitive data like password
        const { password: _, ...userInfo } = user;

        res.status(200).json({ message: "Login successful", user: userInfo });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Failed to login" });
    }
};

// Logout controller
export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set true in production
            sameSite: "strict", // Prevent CSRF attacks
        }).status(200).json({ message: "Logout Successful" });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Failed to logout" });
    }
};
