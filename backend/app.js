import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import { configDotenv } from "dotenv";
import userRoute from "./Routes/userRoute.js";
import Progress from "./Models/Progress.js";
import learning_resource from "./Routes/learning_resourse_Route.js";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_spec.js";
import jobRoute from "./Routes/jobRoute.js";
import skillRoute from "./Routes/skillRoute.js";

configDotenv();
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/progress",Progress);
app.use('/api/v1/jobs', jobRoute);
app.use('/api/v1/skills', skillRoute);
app.use("/api/v1/resources", learning_resource);


// Swagger Configuration
app.use('/skill-bridge-api-spec', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Swagger UI will be available at http://localhost:5000/skill-bridge-api-spec

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
