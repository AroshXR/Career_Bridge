import { configDotenv } from "dotenv";
configDotenv();

import mongoose from "mongoose";
import { log } from "node:console"
import express from "express";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import "./config/passport.js";

import path from "path";
import { fileURLToPath } from "url";

import userRoute from "./Routes/userRoute.js";
import progressRoutes from "./Routes/progressRoutes.js";
import learning_resource from "./Routes/learning_resourse_Route.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_docs/swagger_spec.js";
import jobRoute from "./Routes/jobRoute.js";
import skillRoute from "./Routes/skillRoute.js";
import authRoutes from "./Routes/authRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import economy from "./Routes/economyDetailsRoute.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import { initRoadmapReminders } from "./utils/cronScheduler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

// Trust proxy for Render/SSL
app.set('trust proxy', 1);

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware
//  middleware - bawa chnaged
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/progress", progressRoutes);
app.use('/api/v1/trendingJobAnalyzer', jobRoute);
app.use('/api/v1/skills', skillRoute);
app.use("/api/v1/resources", learning_resource);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/economy", economy);

// Swagger Configuration
app.use(['/career-bridge-api-spec', '/skill-bridge-api-spec'], swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic health check
app.get("/", (_req, res) => {
    res.send("Career Bridge Backend is running...");
});

// Database connection and listener (only if not in test mode)
const dropStaleIndexes = async () => {
    try {
        await mongoose.connection.collection('skillmodels').dropIndex('jobId_1');
        log('Dropped stale jobId_1 index from skillmodels');
    } catch (err) {
        // Index doesn't exist — nothing to do
    }
};

const db_connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        log(`MongoDB Successfully Connected`);

        // Drop any stale single-field unique indexes left over from older schema versions
        await dropStaleIndexes();

        // Initialize Background Email Jobs
        initRoadmapReminders();

        app.listen(PORT, () => {
            log(`Server Running on PORT ${PORT}`);
        });
    } catch (err) {
        log(`Error Occur while Connecting to MongoDB`);
        log("Error was: ", err);
    }
};

if (process.env.NODE_ENV !== 'test') {
    db_connect();
}

export default app;
