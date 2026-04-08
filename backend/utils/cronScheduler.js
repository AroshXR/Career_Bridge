import cron from "node-cron";
import Progress from "../Models/Progress.js";
import { sendEmail } from "./sendEmail.js";

export const initRoadmapReminders = () => {
  // Runs every day at 09:00 and 21:00 server time
  cron.schedule("0 9,21 * * *", async () => {
    console.log("⏰ Running Roadmap Email Reminder Job...");

    try {
      // 1. Find all progress that is NOT 100% completed
      // We populate 'userId' to seamlessly get the user's name and email
      const activeRoadmaps = await Progress.find({ progressPercentage: { $lt: 100 } })
        .populate("userId", "name email");

      // 2. Group the roadmaps by User Email 
      // This prevents sending 2 separate emails to the same person if they are learning multiple skills
      const userGroupedRoadmaps = {};

      activeRoadmaps.forEach((roadmap) => {
        // If a roadmap somehow has no user attached, skip it for safety
        if (!roadmap.userId) return;

        const userEmail = roadmap.userId.email;
        if (!userGroupedRoadmaps[userEmail]) {
          userGroupedRoadmaps[userEmail] = {
            name: roadmap.userId.name,
            skills: []
          };
        }
        userGroupedRoadmaps[userEmail].skills.push(roadmap.skillName);
      });

      // 3. Loop through grouped users and build a nice combined email for each
      for (const email in userGroupedRoadmaps) {
        const { name, skills } = userGroupedRoadmaps[email];
        
        // Format the skills nicely (e.g., "Java, Python, and React")
        const skillsList = skills.join(", ");

        const subject = "🚀 Keep up the great work on your learning roadmaps!";
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${name},</h2>
            <p>This is a quick reminder to continue your progress on your highly-anticipated learning roadmaps:</p>
            <h3 style="color: #6c5ce7;">${skillsList}</h3>
            <p>Log in to your SkillBridge dashboard today to check off your next milestone!</p>
            <br/>
            <p>Best regards,<br/>The SkillBridge Team</p>
          </div>
        `;

        // Wait to send the email so we don't trip spam filters
        await sendEmail(email, subject, "Roadmap Reminder", html);
      }

      console.log(`✅ Automated Reminders Sent to ${Object.keys(userGroupedRoadmaps).length} active users.`);

    } catch (error) {
      console.error("❌ Error running cron job:", error);
    }
  });

  console.log("🕒 Roadmap Reminder Cron Job Initialized.");
};
