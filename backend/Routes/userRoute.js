import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../Controllers/userController.js";
import { analyzeUserProgress } from "../Controllers/userProgressAnalyzer.js";

const router = express.Router();

// Standard CRUD
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Progress Analysis
router.get("/:id/analyze", analyzeUserProgress);

export default router;
