import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Registration controller
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            },
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log("Registration Error:", err);
        if (err.code === "P2002") {
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
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ message: "Invalid Credentials" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials" });

        // Set token expiration time (1 week)
        const tokenExpiration = "7d"; // 7 days in JWT time format
        const token = jwt.sign(
            { id: user.id, isAdmin: false },
            process.env.JWT_SECRET_KEY,
            { expiresIn: tokenExpiration }
        );

        const { password: userPassword, ...userInfo } = user;

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
        }).status(200).json(userInfo);
    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({ message: "Failed to login" });
    }
};

// Logout controller
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
