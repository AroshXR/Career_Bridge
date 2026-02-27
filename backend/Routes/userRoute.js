import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/userController.js";
import { analyzeUserProgress } from "../Controllers/userProgressAnalyzer.js";

// ===== ADD THESE IMPORTS =====
import {
    generateCV,
    saveCVData,
    getMyCV,
    importFromGitHub,
    getSkillSuggestions
} from "../Controllers/cvController.js";
// ===== END OF IMPORTS =====

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Standard CRUD - NO PROTECTION NEEDED
router.post("/", createUser);
router.get("/", authMiddleware, getUsers);           // ADD authMiddleware
router.get("/:id", authMiddleware, getUserById);     // ADD authMiddleware
router.put("/:id", authMiddleware, updateUser);      // ADD authMiddleware
router.delete("/:id", authMiddleware, deleteUser);   // ADD authMiddleware


// Progress Analysis
router.get("/:id/analyze", authMiddleware, analyzeUserProgress); // ADD authMiddleware

// ===== NEW CV ROUTES (ADD THESE BELOW - DON'T DELETE ANY EXISTING CODE) =====
// CV Generation and Management
router.post("/cv/generate", authMiddleware, generateCV);           // Generate PDF
router.post("/cv/save", authMiddleware, saveCVData);               // Save to profile
router.get("/cv/my-cv", authMiddleware, getMyCV);                  // Get saved CV

// Third-party API integrations
router.post("/cv/import/github", authMiddleware, importFromGitHub); // Import from GitHub
router.get("/cv/skills/:jobRole", authMiddleware, getSkillSuggestions); // Skill suggestions
// ===== END OF NEW CV ROUTES =====

export default router;