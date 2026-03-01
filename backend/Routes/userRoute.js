import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/userController.js";
import { analyzeUserProgress } from "../Controllers/userProgressAnalyzer.js";


import {
    generateCV,
    saveCVData,
    getMyCV,
    importFromGitHub,
    getSkillSuggestions
} from "../Controllers/cvController.js";


import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Standard CRUD 
router.post("/", createUser);
router.get("/", authMiddleware, getUsers);           
router.get("/:id", authMiddleware, getUserById);     
router.put("/:id", authMiddleware, updateUser);      
router.delete("/:id", authMiddleware, deleteUser);   


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