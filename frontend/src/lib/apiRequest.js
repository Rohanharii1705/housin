import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) return res.status(403).json({ message: "Token is not valid or expired!" });

        req.userId = payload.id;
        req.isAdmin = payload.isAdmin;
        next();
    });
};
