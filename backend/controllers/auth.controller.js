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

        // Generate access token and refresh token
        const accessToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: '1w' });
        const refreshToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '30d' });

        const { password: userPassword, ...userInfo } = user;

        // Set access token and refresh token in cookies
        res.cookie("token", accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });  // 1 week
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });  // 30 days

        res.status(200).json(userInfo);
    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({ message: "Failed to login" });
    }
};


// Refresh Token Controller
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate new access token
        const newAccessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1w' });

        // Send new access token in response
        res.cookie("token", newAccessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });  // 1 week
        res.status(200).json({ message: "Token refreshed" });
    });
};

// Logout controller
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
