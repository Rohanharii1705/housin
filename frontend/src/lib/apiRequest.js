import cors from "cors";

const corsOptions = {
    origin: "https://housin.vercel.app", // Replace with your frontend URL
    credentials: true, // Allow cookies (for sending the token)
};

app.use(cors(corsOptions));
