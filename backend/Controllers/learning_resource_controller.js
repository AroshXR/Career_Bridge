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
      maxResults: 10,
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

    const url = `https://api.dailymotion.com/videos?search=${encodeURIComponent(skill)}+course&fields=id,title,thumbnail_480_url,url,duration&limit=10`;

    const response = await axios.get(url);

    const courses = response.data.list.map(video => ({
      title: video.title,
      thumbnail: video.thumbnail_480_url,
      videoUrl: video.url,
      duration: Math.floor(video.duration / 60) + " mins", // Convert seconds to minutes
      platform: 'Dailymotion',
      price: 'Free'
    }));

    res.status(200).json(courses);

  } catch (error) {
    console.log(`Error Occur in Paid & Unpaid Courses fetch section...Error is${error}`);
    res.status(500).json({ message: "Error Occur in Paid & Unpaid Courses fetch section" });
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

  const { userId } = req.params;

  try {

    const findCourses = await resource_Model.find({ userId }).sort({ createdAt: -1 });

    if (!findCourses || findCourses.length === 0) {
      return res.status(404).json({ message: "No saved courses found for this user." });
    }

    return res.status(200).json(findCourses);

  } catch (error) {

    console.error("Error fetching saved resources:", error.message);
    res.status(500).json({ message: "Server error while fetching resources" });

  }
}

