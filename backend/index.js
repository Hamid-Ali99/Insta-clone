import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

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

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on Port: ${PORT}`);
});
