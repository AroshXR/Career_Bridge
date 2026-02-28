import express from "express";
import {
  startSkill,
  getUserProgress,
  completeTask,
  checkReminder
} from "../Controllers/progressController.js";

const router = express.Router();

router.post("/", startSkill);
router.get("/user/:userId", getUserProgress);
router.put("/complete-task", completeTask);

// Trigger email reminders (can also use cron later)
router.get("/reminder/send", checkReminder);

export default router;


//progressRoutes