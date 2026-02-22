import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import { configDotenv } from "dotenv";
import userRoute from "./Routes/userRoute.js";

configDotenv();
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoute);

// Basic health check
app.get("/", (req, res) => {
  res.send("Skill Bridge Backend is running...");
});

const db_connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    log(`MongoDB Successfully Connected`);
    app.listen(PORT, () => {
      log(`Server Running on PORT ${PORT}`);
    });
  } catch (err) {
    log(`Error Occur while Connecting to MongoDB`);
    log("Error was: ", err);
  }
};

db_connect();
