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
    // try {
    //   const user = await User.findById(userId);
    //   if (user && user.email) {
    //     const welcomeHtml = `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //         <meta charset="UTF-8">
    //         <style>
    //             .button:hover { background-color: #0056b3 !important; }
    //         </style>
    //     </head>
    //     <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    //         <table border="0" cellpadding="0" cellspacing="0" width="100%">
    //             <tr>
    //                 <td align="center" style="padding: 20px 0;">
    //                     <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    //                         <!-- Navbar Section -->
    //                         <tr>
    //                             <td align="center" style="padding: 25px 0; border-bottom: 1px solid #f1f5f9;">
    //                                 <div style="font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
    //                                     Career<span style="color: #007bff;">Bridge</span>
    //                                 </div>
    //                             </td>
    //                         </tr>
    //                         <!-- Header Image -->
    //                         <tr>
    //                             <td align="center" style="background: linear-gradient(135deg, #007bff 0%, #00d4ff 100%); padding: 50px 20px;">
    //                                 <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Great Choice, ${user.name}!</h1>
    //                                 <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Success starts with the first step.</p>
    //                             </td>
    //                         </tr>
    //                         <!-- Content -->
    //                         <tr>
    //                             <td style="padding: 50px 40px; text-align: center;">
    //                                 <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px;">"${skillName}" roadmap has started.</h2>
    //                                 <p style="color: #64748b; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
    //                                     You’ve successfully started this career-defining learning roadmap. We’ve set AI-driven milestones to help you stay on track and reach your goals.
    //                                 </p>
    //                                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/" class="button" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,123,255,0.2);">View My Progress</a>
    //                             </td>
    //                         </tr>
    //                         <!-- Footer -->
    //                         <tr>
    //                             <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #f1f5f9;">
    //                                 <p style="font-size: 13px; color: #94a3b8; margin: 0;">
    //                                     &copy; 2026 <strong>CareerBridge</strong>. All rights reserved.
    //                                 </p>
    //                             </td>
    //                         </tr>
    //                     </table>
    //                 </td>
    //             </tr>
    //         </table>
    //     </body>
    //     </html>
    //     `;

    //     await sendEmail(
    //       user.email,
    //       `You just started learning ${skillName}!`,
    //       `You have successfully started the ${skillName} roadmap`,
    //       welcomeHtml
    //     );
    //   }
    // } catch (emailError) {
    //   console.error("Failed to send welcome email:", emailError.message);
    // }

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