import express from "express";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";

const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

export default router;