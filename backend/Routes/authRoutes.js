import passport from "passport";
import jwt from "jsonwebtoken";

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

// Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT for your existing middleware
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Basic user data for frontend initialization
    const userData = {
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      _id: req.user._id
    };

    // Redirect to frontend with token AND user data
    const redirectUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${redirectUrl}/home?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

export default router;