import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { server, app } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

// our apis
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRoute);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Am comming from backend",
//     success: true,
//   });
// });

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on Port: ${PORT}`);
});
