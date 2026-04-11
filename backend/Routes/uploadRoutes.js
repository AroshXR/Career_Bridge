import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure storage for CVs
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cv-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create directories if they don't exist
if (!fs.existsSync("uploads/profiles")) {
  fs.mkdirSync("uploads/profiles", { recursive: true });
}
if (!fs.existsSync("uploads/cvs")) {
  fs.mkdirSync("uploads/cvs", { recursive: true });
}

const uploadProfile = multer({ storage: profileStorage });
const uploadCV = multer({ storage: cvStorage });

// Upload profile picture - ADD AUTH MIDDLEWARE
router.post("/profile-picture/:userId", authMiddleware, uploadProfile.single("image"), async (req, res) => {
  try {
    // ADD THIS CHECK - Verify user is uploading to their own account
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'You can only upload to your own profile' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload CV - ADD AUTH MIDDLEWARE
router.post("/cv/:userId", authMiddleware, uploadCV.single("cv"), async (req, res) => {
  try {
    // ADD THIS CHECK - Verify user is uploading to their own account
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'You can only upload to your own profile' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const cvUrl = `/uploads/cvs/${req.file.filename}`;
    res.json({ cvUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;