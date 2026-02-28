import Progress from "../Models/Progress.js";
import User from "../Models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

// 1️⃣ Start Skill (Create Progress)
export const startSkill = async (req, res) => {
  try {
    const { userId, skillId, skillName, tasks } = req.body;

    const existingProgress = await Progress.findOne({ userId, skillId });

    if (existingProgress) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Skill already started", "Start skill failed"));
    }

    const newProgress = new Progress({
      userId,
      skillId,
      skillName,
      tasks,
      nextReminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
    });

    await newProgress.save();

    res.status(201).json(ResponseGenerator.sendSuccess(newProgress, "Skill started successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Start skill failed", error.message));
  }
};

// 2️⃣ Get User Progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.status(200).json(ResponseGenerator.sendSuccess(progress, "User progress retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch progress failed", error.message));
  }
};

// 3️⃣ Mark Task Completed
export const completeTask = async (req, res) => {
  try {
    const { progressId, taskIndex } = req.body;

    const progress = await Progress.findById(progressId);

    if (!progress) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Progress not found", "Task completion failed"));
    }

    progress.tasks[taskIndex].completed = true;

    // Calculate percentage
    const totalTasks = progress.tasks.length;
    const completedTasks = progress.tasks.filter(t => t.completed).length;

    progress.progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    if (progress.progressPercentage === 100) {
      progress.status = "Completed";
    }

    await progress.save();

    res.status(200).json(ResponseGenerator.sendSuccess(progress, "Task marked as completed"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Task completion failed", error.message));
  }
};

// 4️⃣ Check Reminder & Send Emails
export const checkReminder = async (req, res) => {
  try {
    const today = new Date();

    const reminders = await Progress.find({
      reminderEnabled: true,
      nextReminderDate: { $lte: today },
      status: "In Progress",
    }).populate("userId"); // get user info

    for (const progress of reminders) {
      const user = progress.userId;
      if (!user || !user.email) continue;

      const incompleteTasks = progress.tasks.filter(t => !t.completed);
      if (incompleteTasks.length === 0) continue;

      const taskList = incompleteTasks.map(t => `- ${t.title}: ${t.resourceLink}`).join("\n");

      const subject = `Reminder: Complete your ${progress.skillName} tasks`;
      const text = `Hi ${user.name},\n\nYou have incomplete tasks for "${progress.skillName}":\n${taskList}\n\nKeep learning!`;

      const html = `<p>Hi ${user.name},</p>
        <p>You have incomplete tasks for the skill "<strong>${progress.skillName}</strong>":</p>
        <ul>
          ${incompleteTasks.map(t => `<li>${t.title} - <a href="${t.resourceLink}">Link</a></li>`).join("")}
        </ul>
        <p>Keep learning and stay consistent!</p>`;

      await sendEmail(user.email, subject, text, html);

      // Update next reminder date (+3 days)
      progress.nextReminderDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      await progress.save();
    }

    res.status(200).json(ResponseGenerator.sendSuccess({ count: reminders.length }, "Reminders processed successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Reminder processing failed", error.message));
  }
};

//Progress COntroller