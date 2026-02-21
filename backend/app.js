import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import { configDotenv } from "dotenv";
import learning_resource from "./Routes/learning_resourse_Route.js";

configDotenv();
const PORT = process.env.PORT || 4000;
const app = express();

app.use("/api/v1/resources", learning_resource);

const db_connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    log(`MongoDB Successfully Connected`);
    app.listen(PORT, 'localhost', () => { log(`Server Running on http://localhost:${PORT}`); });
  } catch (err) {
    log(`Error Occur while Connecting to MongoDB`);
    log("Error was: ", err);
  }
};

db_connect();