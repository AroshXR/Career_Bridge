import express from "express";
import {
  checkEnv,
  testAuth,
  register,
  login
} from "../Controllers/authController.js";

const router = express.Router();

// Route to check environment variables
router.get("/check-env", checkEnv);

// Test route
router.get("/test", testAuth);

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

export default router;