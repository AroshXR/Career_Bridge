import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import cors from "cors";
import {configDotenv} from "dotenv";

configDotenv();
import path from "path";
import { fileURLToPath } from "url"; // ADD THIS IMPORT

import userRoute from "./Routes/userRoute.js";
import progress from "./Models/Progress.js";
import learning_resource from "./Routes/learning_resourse_Route.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_spec.js";
import jobRoute from "./Routes/jobRoute.js";
import skillRoute from "./Routes/skillRoute.js";
import authRoutes from "./Routes/authRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

//  middleware - bawa chnaged
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/progress", progress);
app.use('/api/v1/jobs', jobRoute);
app.use('/api/v1/skills', skillRoute);
app.use("/api/v1/resources", learning_resource);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Swagger Configuration
app.use('/skill-bridge-api-spec', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//Swagger open URL : http://localhost:5000/skill-bridge-api-spec/

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
