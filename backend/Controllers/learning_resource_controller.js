import { configDotenv } from "dotenv";
import { google } from "googleapis";
import resource_Model from "../Models/learning_resource_Model.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

configDotenv();

const youtube = google.youtube('v3');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const skillSearch = async (req, res) => {

  try {
    const { skill } = req.params;

    if (!skill) {
      return res.status(400).json({ message: "Skill Name is required" });
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

    res.status(200).json(videos);
  } catch (error) {
    console.error("YouTube API Error:", error);
    res.status(500).json({ message: "Error fetching videos from YouTube" });
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

    res.status(200).json(courses);

  } catch (error) {
    console.log(`Error in Courses fetch: ${error.message}`);
    res.status(500).json({ message: "Error Occur in Professional Courses fetch section" });
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

    res.status(200).json({
      skill: skill,
      roadmap: cleanJson.roadmap
    });

  } catch (error) {
    if (error.status === 503 && attempts < maxAttempts) {
      console.log(`Gemini server busy try again later`);
    }
    console.error("AI Roadmap Error:", error);
    res.status(500).json({ message: "Could not generate roadmap" });
  }
};

export const getAllSavedCoursesById = async (req, res) => {

  const { userId } = req.params; // Using userId from route params

  try {
    // Corrected: using .find({ userId }) instead of .findById({ userId }) 
    // to list all saved videos belonging to the passed userId.
    const findCourses = await resource_Model.find({ userId }).sort({ createdAt: -1 });

    if (!findCourses || findCourses.length === 0) {
      return res.status(404).json({ message: "No saved courses found for this user." });
    }

    return res.status(200).json(findCourses);

  } catch (error) {

    console.error("Error fetching saved resources:", error.message);
    res.status(500).json({ message: "Server error while fetching resources" });

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
      return res.status(400).json({ message: "Required fields are missing." });
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

    res.status(200).json({
      message: "Resource saved successfully",
      savedResource,
    });
  } catch (error) {
    console.error("Error saving resource:", error.message);
    res.status(500).json({ message: "Server error while saving resource" });
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
      return res.status(400).json({ message: "Resource ID (id) is required." });
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
      return res.status(404).json({ message: "Resource not found." });
    }

    res.status(200).json({
      message: "Resource updated successfully",
      updatedResource
    });

  } catch (error) {
    console.error("Error occur while update saving resource:", error.message);
    res.status(500).json({ message: "Server error while update saving resource" });
  }
};

export const deleteSavedResources = async (req, res) => {

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Resource ID is required." });
    }

    const result = await resource_Model.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: "Resource Successfully Deleted" });
    } else {
      return res.status(404).json({ message: "Resource not found." });
    }
  } catch (error) {
    console.log(`Error Occur while deleting resource....Error: ${error}`);
    res.status(500).json({ message: "Error Occur while deleting resource." });
  }
};