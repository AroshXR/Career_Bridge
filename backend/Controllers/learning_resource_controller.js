import { configDotenv } from "dotenv";
import { google } from "googleapis";
import resource_Model from "../Models/learning_resource_Model.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ResponseGenerator from "../utils/ResponseGenerator.js";
import { sendEmailsForReminder } from "../utils/sendEmailsForCourseReminder.js";
import cron from "node-cron";

configDotenv();

const youtube = google.youtube('v3');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const skillSearch = async (req, res) => {

  try {
    const { skill } = req.params;

    if (!skill) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Skill Name is required", "YouTube search failed"));
    }

    const response = await youtube.search.list({
      key: process.env.YOUTUBE_DATA_API_KEY,
      part: 'snippet',
      q: `${skill} complete course tutorial`, // Refines search for learning content
      maxResults: 20,
      type: 'video',
      order: 'relevance',
      videoDuration: 'long',
      relevanceLanguage: 'en'
    });

    // Map the data into a clean format for your frontend
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.status(200).json(ResponseGenerator.sendSuccess(videos, "YouTube videos fetched successfully"));
  } catch (error) {
    console.error("YouTube API Error:", error);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Error fetching videos from YouTube", error.message));
  }
};


export const findProfessionalCourses = async (req, res) => {
  try {
    const { skill } = req.params;

    // Added 'longer_than=60' to ensure videos are 1 hour or more
    const url = `https://api.dailymotion.com/videos?search=${encodeURIComponent(skill)}+course&fields=id,title,thumbnail_480_url,url,duration&longer_than=60&limit=10`;

    const response = await axios.get(url);

    const courses = response.data.list.map(video => {
      // Logic to show duration in "Xh Ym" format (e.g., 1h 25m)
      const totalMinutes = Math.floor(video.duration / 60);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

      return {
        title: video.title,
        thumbnail: video.thumbnail_480_url,
        videoUrl: video.url,
        duration: durationText,
        platform: 'Dailymotion'
      };
    });

    res.status(200).json(ResponseGenerator.sendSuccess(courses, "Professional courses fetched successfully"));

  } catch (error) {
    console.log(`Error in Courses fetch: ${error.message}`);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Error fetching professional courses", error.message));
  }
};


export const generateRoadMap = async (req, res) => {

  try {
    const { skill } = req.params;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // We give a strict prompt to ensure we get a clean list
    const prompt = `Generate a 10-step learning roadmap for the skill "${skill}". 
    Return ONLY a JSON object with a key "roadmap" containing an array of strings. 
    Example: {"roadmap": ["step1", "step2", "step3"]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text to ensure it's valid JSON
    const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));

    res.status(200).json(ResponseGenerator.sendSuccess({
      skill: skill,
      roadmap: cleanJson.roadmap
    }, "AI Roadmap generated successfully"));

  } catch (error) {
    if (error.status === 503 && attempts < maxAttempts) {
      console.log(`Gemini server busy try again later`);
    }
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Could not generate roadmap", error.message));
  }
};

export const getAllSavedCoursesById = async (req, res) => {

  const { userId } = req.params; // Using userId from route params

  try {
    // Corrected: using .find({ userId }) instead of .findById({ userId }) 
    // to list all saved videos belonging to the passed userId.
    const findCourses = await resource_Model.find({ userId }).sort({ createdAt: -1 });

    if (!findCourses || findCourses.length === 0) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "No saved courses found for this user.", "Fetch failed"));
    }

    return res.status(200).json(ResponseGenerator.sendSuccess(findCourses, "Saved courses retrieved successfully"));

  } catch (error) {
    console.error("Error fetching saved resources:", error.message);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while fetching resources", error.message));

  }
};

export const saveResource = async (req, res) => {
  try {
    const {
      userId,
      skillId,
      skillName,
      videoTitle,
      videoUrl,
      thumbnail,
      userEmail,
      scheduledTime,
      priority,
      notes,
    } = req.body;

    if (!userId || !skillId || !skillName || !videoTitle || !videoUrl || !userEmail || !scheduledTime) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Required fields are missing.", "Save resource failed"));
    }

    const newResource = new resource_Model({
      userId,
      skillId,
      skillName,
      videoTitle,
      videoUrl,
      thumbnail,
      userEmail,
      scheduledTime,
      priority,
      notes,
    });

    const savedResource = await newResource.save();

    // Send confirmation email in background (non-blocking)
    sendEmailsForReminder(userEmail, `Course Reminder About ${skillName}`, `

        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                .button:hover { background-color: #0056b3 !important; }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                            <!-- Navbar Section -->
                            <tr>
                                <td align="center" style="padding: 25px 0; border-bottom: 1px solid #f1f5f9;">
                                    <div style="font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
                                        Career<span style="color: #007bff;">Bridge</span>
                                    </div>
                                </td>
                            </tr>
                            <!-- Header Image -->
                            <tr>
                                <td align="center" style="background: linear-gradient(135deg, #007bff 0%, #00d4ff 100%); padding: 50px 20px;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Great Choice!</h1>
                                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Success starts with the first step.</p>
                                </td>
                            </tr>
                            <!-- Content -->
                            <tr>
                                <td style="padding: 50px 40px; text-align: center;">
                                    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px;">"${videoTitle}" is saved.</h2>
                                    <p style="color: #64748b; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                                        You’ve successfully added this course to your library. We’ve set a reminder for you to help you stay on track with your goals.
                                    </p>
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/" class="button" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,123,255,0.2);">View My Library</a>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #f1f5f9;">
                                    <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                                        &copy; 2026 <strong>CareerBridge</strong>. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>

      `);

    scheduleReminderEmail(userEmail, `Course Reminder About ${skillName}`,
      `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                            <!-- Navbar Section -->
                            <tr>
                                <td align="center" style="padding: 25px 0; border-bottom: 1px solid #f1f5f9;">
                                    <div style="font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
                                        Career<span style="color: #007bff;">Bridge</span>
                                    </div>
                                </td>
                            </tr>
                            <!-- Header Image -->
                            <tr>
                                <td>
                                    <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80" alt="Reminder" width="600" style="display: block; width: 100%;">
                                </td>
                            </tr>
                            <!-- Content Section -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="text-transform: uppercase; color: #007bff; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 10px; font-size: 13px;">Friendly Reminder</p>
                                    <h1 style="font-size: 32px; margin: 0 0 20px 0; color: #1a1a1a; letter-spacing: -0.5px;">Ready to continue?</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #64748b;">
                                        Hello there! You were making great progress on <strong>${videoTitle}</strong>. Don't let your momentum slide—just 15 minutes of study today can make a huge difference in your career journey.
                                    </p>
                                    
                                    <div style="background-color: #f8fafc; border-left: 4px solid #007bff; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                                        <p style="margin: 0; font-weight: 700; color: #1a1a1a; font-size: 14px;">Next Session Goals:</p>
                                        <p style="margin: 5px 0 0 0; color: #64748b;">Complete another module and apply your skills.</p>
                                    </div>

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center">
                                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/" style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: #ffffff; padding: 16px 45px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(0,123,255,0.2);">Resume Learning</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 30px; border-top: 1px solid #f1f5f9; text-align: center; background-color: #f8fafc;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                                        You're receiving this because you're enrolled in <strong>CareerBridge</strong>.<br>
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> from these reminders.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
      new Date(scheduledTime));

    res.status(200).json(ResponseGenerator.sendSuccess(savedResource, "Resource saved and reminder scheduled successfully"));
  } catch (error) {
    console.error("Error saving resource:", error.message);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while saving resource", error.message));
  }
};

export const updateSaveResource = async (req, res) => {
  try {
    const {
      id, // Resource ID (_id)
      userEmail,
      scheduledTime,
      priority,
      notes,
      isCompleted
    } = req.body;

    if (!id) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Resource ID (id) is required.", "Update failed"));
    }

    // Build the update object with only allowed fields
    const updateData = {};
    if (userEmail !== undefined) updateData.userEmail = userEmail;
    if (scheduledTime !== undefined) updateData.scheduledTime = scheduledTime;
    if (priority !== undefined) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    // Use findByIdAndUpdate to update the specific resource
    const updatedResource = await resource_Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedResource) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Resource not found.", "Update failed"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(updatedResource, "Resource updated successfully"));

  } catch (error) {
    console.error("Error occur while update saving resource:", error.message);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while update saving resource", error.message));
  }
};

export const deleteSavedResources = async (req, res) => {

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Resource ID is required.", "Delete failed"));
    }

    const result = await resource_Model.findByIdAndDelete(id);

    if (result) {
      res.status(200).json(ResponseGenerator.sendSuccess(null, "Resource Successfully Deleted"));
    } else {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Resource not found.", "Delete failed"));
    }
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Error occurred while deleting resource.", error.message));
  }
};

const scheduleReminderEmail = (mto, mSubject, html, scheduledDate) => {

  const second = scheduledDate.getSeconds();
  const minute = scheduledDate.getMinutes();
  const hour = scheduledDate.getHours();
  const day = scheduledDate.getDate();
  const month = scheduledDate.getMonth() + 1; // JS months are 0-11

  const cronExpression = `${second} ${minute} ${hour} ${day} ${month} *`;

  const task = cron.schedule(cronExpression, async () => {
    try {
      await sendEmailsForReminder(mto, mSubject, html);
      task.stop(); // Stop the task so it doesn't repeat next year
    } catch (error) {
      console.error("Cron Error while sending email:", error.message);
    }
  });
};