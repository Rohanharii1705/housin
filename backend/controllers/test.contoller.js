// test.controller.js
import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
    console.log(req.userId); // Should log the user ID set by verifyToken middleware
    res.status(200).json({ message: "Authenticated", userId: req.userId });
};

export const shouldBeAdmin = (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Not authorized!" });
    }
    res.status(200).json({ message: "Authenticated as Admin" });
};
