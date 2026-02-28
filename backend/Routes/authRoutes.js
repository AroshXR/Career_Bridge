import express from "express";
import {
  checkEnv,
  testAuth,
  register,
  login
} from "../Controllers/authController.js";

const router = express.Router();

router.get("/check-env", checkEnv); // Route to check environment variables
router.get("/test", testAuth); // Test route
router.post("/register", register); // Route for user registration
router.post("/login", login); // Route for user login

export default router;