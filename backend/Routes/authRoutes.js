import express from "express";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";

const router = express.Router();

// Generate custom userId
const generateUserId = async () => {
  try {
    const lastUser = await User.findOne().sort({ userId: -1 });
    console.log("Last user found:", lastUser); // Debug log

    let nextId = "001";

    if (lastUser && lastUser.userId) {
      const lastNum = parseInt(lastUser.userId);
      const newNum = lastNum + 1;
      nextId = newNum.toString().padStart(3, '0');
    }

    console.log("Generated userId:", nextId); // Debug log
    return nextId;
  } catch (error) {
    console.error("Error generating userId:", error);
    throw error;
  }
};

// Register Route
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body); // Debug log

    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log("Missing fields:", { firstName, lastName, email, password: password ? "provided" : "missing" });
      return res.status(400).json({
        message: "All fields are required",
        details: {
          firstName: !firstName ? "missing" : "ok",
          lastName: !lastName ? "missing" : "ok",
          email: !email ? "missing" : "ok",
          password: !password ? "missing" : "ok"
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate custom userId
    const userId = await generateUserId();

    // Create new user
    const newUser = new User({
      userId: userId,
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
    });

    console.log("Attempting to save user:", { userId, name: newUser.name, email }); // Debug log

    await newUser.save();
    console.log("User saved successfully with ID:", newUser._id); // Debug log

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful",
      user: userResponse
    });

  } catch (error) {
    console.error("Detailed registration error:", error);

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or userId already exists"
      });
    }

    // Send more specific error message
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", { email: req.body.email }); // Debug log

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found, checking password"); // Debug log

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Login successful for:", email); // Debug log

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

export default router;