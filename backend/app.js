import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_spec.js";
import jobRoute from "./Routes/jobRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/jobs', jobRoute);

// Swagger Configuration
app.use('/skill-bridge-api-spec', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Swagger UI will be available at http://localhost:5000/skill-bridge-api-spec

const db_connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL); // Support both env vars
        console.log(`MongoDB Successfully Connected`);
        app.listen(PORT, () => {
            console.log(`Server Running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log(`Error Occurred while Connecting to MongoDB`);
        console.log("Error was: ", err);
    }
};

db_connect();
