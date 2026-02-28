import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import { configDotenv } from "dotenv";
import userRoute from "./Routes/userRoute.js";
import progressRoutes from "./Routes/progressRoutes.js";
import learning_resource from "./Routes/learning_resourse_Route.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_docs/swagger_spec.js";
import jobRoute from "./Routes/jobRoute.js";
import skillRoute from "./Routes/skillRoute.js";
import authRoutes from "./Routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

configDotenv();
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/progress", progressRoutes);
app.use('/api/v1/jobs', jobRoute);
app.use('/api/v1/skills', skillRoute);
app.use("/api/v1/resources", learning_resource);
app.use("/api/auth", authRoutes);



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
