import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserStatus,
    deleteUserAsAdmin
} from "../Controllers/userController.js";
import { getAdminStats } from "../Controllers/adminController.js";
import { analyzeUserProgress } from "../Controllers/userProgressAnalyzer.js";


import {
    generateCV,
    saveCVData,
    getMyCV,
    importFromGitHub,
    getSkillSuggestions
} from "../Controllers/cvController.js";


import authMiddleware from "../middleware/auth.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";

const router = express.Router();

// Standard CRUD 
router.post("/", createUser);
router.get("/", adminAuthMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

// Admin Override and Status Management
router.get("/admin/stats", adminAuthMiddleware, getAdminStats);
router.put("/:id/status", adminAuthMiddleware, updateUserStatus);
router.delete("/admin/:id", adminAuthMiddleware, deleteUserAsAdmin);


// Progress Analysis
router.get("/:id/analyze", authMiddleware, analyzeUserProgress); // ADD authMiddleware


// CV Generation and Management
router.post("/cv/generate", authMiddleware, generateCV);           // Generate PDF
router.post("/cv/save", authMiddleware, saveCVData);               // Save to profile
router.get("/cv/my-cv", authMiddleware, getMyCV);                  // Get saved CV

// Third-party API integrations
router.post("/cv/import/github", authMiddleware, importFromGitHub); // Import from GitHub
router.get("/cv/skills/:jobRole", authMiddleware, getSkillSuggestions); // Skill suggestions


export default router;