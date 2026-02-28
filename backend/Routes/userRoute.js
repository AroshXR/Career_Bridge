import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/userController.js";
import { analyzeUserProgress } from "../Controllers/userProgressAnalyzer.js";
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

export default router;