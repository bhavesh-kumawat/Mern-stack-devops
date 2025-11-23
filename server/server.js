import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 8000;

connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API EndPoints
app.get("/", (req, res) => {
  res.send("Api workings");
});

app.use("/api/users", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`server running on port: ${port}`));
