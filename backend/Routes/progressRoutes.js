import express from "express";
import {
  startSkill,
  getUserProgress,
  completeTask,
  checkReminder,
  deleteProgress
} from "../Controllers/progressController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, startSkill);
router.get("/user/:userId", auth, getUserProgress);
router.put("/complete-task", auth, completeTask);
router.delete("/:id", auth, deleteProgress);

// Trigger email reminders (can also use cron later)
router.get("/reminder/send", checkReminder);

export default router;


//progressRoutes