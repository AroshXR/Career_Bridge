import Progress from "../Models/Progress.js";
import User from "../Models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

// Start Skill (save a roadmap)
export const startSkill = async (req, res) => {
  try {
    const { userId, skillId, skillName, tasks } = req.body;

    if (!userId || !skillName || !tasks) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "userId, skillName and tasks are required", "Start skill failed"));
    }

    // Prevent duplicate: one roadmap per skill per user (check by skillName)
    const existingProgress = await Progress.findOne({ userId, skillName: { $regex: new RegExp(`^${skillName}$`, 'i') } });

    if (existingProgress) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, `You are already following the "${skillName}" roadmap`, "Start skill failed"));
    }

    const newProgress = new Progress({
      userId,
      ...(skillId && { skillId }), // only include skillId if it's provided
      skillName,
      tasks,
      nextReminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
    });

    await newProgress.save();

    // Send Welcome Email
    try {
      const user = await User.findById(userId);
      if (user && user.email) {
        const welcomeHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Congratulations, ${user.name}! 🎉</h2>
            <p>You have successfully started the <b>${skillName}</b> learning roadmap.</p>
            <p>Our AI has crafted a 10-step plan strictly tailored for you. You can track your progress at any time securely through your SkillBridge dashboard!</p>
            <p>Good luck chasing your goals!</p>
            <br/>
            <p>Best regards,<br/>The SkillBridge Team</p>
          </div>
        `;
        
        await sendEmail(
            user.email, 
            `You just started learning ${skillName}! 🚀`, 
            `You have successfully started the ${skillName} roadmap`, 
            welcomeHtml
        );
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
    }

    res.status(201).json(ResponseGenerator.sendSuccess(newProgress, "Skill started successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Start skill failed", error.message));
  }
};

// Get User Progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(ResponseGenerator.sendSuccess(progress, "User progress retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch progress failed", error.message));
  }
};

// Mark Task Completed
export const completeTask = async (req, res) => {
  try {
    const { progressId, taskIndex } = req.body;

    const progress = await Progress.findById(progressId);

    if (!progress) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Progress not found", "Task completion failed"));
    }

    progress.tasks[taskIndex].completed = !progress.tasks[taskIndex].completed; // Toggle

    // Recalculate percentage
    const totalTasks = progress.tasks.length;
    const completedTasks = progress.tasks.filter(t => t.completed).length;
    progress.progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    if (progress.progressPercentage === 100) {
      progress.status = "Completed";
    } else {
      progress.status = "In Progress";
    }

    await progress.save();

    res.status(200).json(ResponseGenerator.sendSuccess(progress, "Task updated successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Task completion failed", error.message));
  }
};

// Delete a saved roadmap
export const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Progress ID is required", "Delete failed"));
    }

    const result = await Progress.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Progress record not found", "Delete failed"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(null, "Roadmap removed from progress successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete progress failed", error.message));
  }
};

// Check Reminder & Send Emails
export const checkReminder = async (req, res) => {
  try {
    const today = new Date();

    const reminders = await Progress.find({
      reminderEnabled: true,
      nextReminderDate: { $lte: today },
      status: "In Progress",
    }).populate("userId");

    for (const progress of reminders) {
      const user = progress.userId;
      if (!user || !user.email) continue;

      const incompleteTasks = progress.tasks.filter(t => !t.completed);
      if (incompleteTasks.length === 0) continue;

      const taskList = incompleteTasks.map(t => `- ${t.title}: ${t.resourceLink || ''}`).join("\n");

      const subject = `Reminder: Complete your ${progress.skillName} tasks`;
      const text = `Hi ${user.name},\n\nYou have incomplete tasks for "${progress.skillName}":\n${taskList}\n\nKeep learning!`;

      const html = `<p>Hi ${user.name},</p>
        <p>You have incomplete tasks for the skill "<strong>${progress.skillName}</strong>":</p>
        <ul>
          ${incompleteTasks.map(t => `<li>${t.title}</li>`).join("")}
        </ul>
        <p>Keep learning and stay consistent!</p>`;

      await sendEmail(user.email, subject, text, html);

      progress.nextReminderDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      await progress.save();
    }

    res.status(200).json(ResponseGenerator.sendSuccess({ count: reminders.length }, "Reminders processed successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Reminder processing failed", error.message));
  }
};

//Progress Controller