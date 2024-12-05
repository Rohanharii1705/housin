// auth.controller.js
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

        // Define token expiration durations
        const accessTokenExpiry = '15m'; // 15 minutes
        const refreshTokenExpiry = '7d'; // 7 days

        // Generate access and refresh tokens
        const accessToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: accessTokenExpiry });
        const refreshToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: refreshTokenExpiry });

        const { password: userPassword, ...userInfo } = user;

        // Store refresh token in HTTP-only cookie for security
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production', // Only in HTTPS in production
        });

        res.cookie("token", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            secure: process.env.NODE_ENV === 'production', // Only in HTTPS in production
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

// Refresh Token Controller
export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) return res.status(401).json({ message: "Refresh token not found" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, payload) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: payload.id, isAdmin: payload.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            secure: process.env.NODE_ENV === 'production', // Only in HTTPS in production
        }).status(200).json({ accessToken: newAccessToken });
    });
};

