import process from "process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SkillModel from "../Models/SkillModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";
import SavedJob from "../Models/SavedJobModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




// --- CREATE: Analyze and Save ---
export const analyzeAndSaveSkills = async (req, res) => {
    const { jobId } = req.params;
    const userEmail = req.user.email;

    try {
        // Return existing analysis if already done
        const existingSkillDoc = await SkillModel.findOne({ jobId, userId: userEmail });
        if (existingSkillDoc) return res.status(200).json(ResponseGenerator.sendSuccess(existingSkillDoc, "Analysis already exists"));

        // Look up the saved job
        const selectedJob = await SavedJob.findOne({ jobId, username: userEmail });
        if (!selectedJob) {
            return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Job not found in your saved list", "Skill analysis failed"));
        }

        // Generate skills using Gemini based on the job title and description
        const skills = await fetchSkillsFromGemini(selectedJob.title, selectedJob.description);

        const newSkillDoc = await SkillModel.create({
            userId: userEmail,
            jobId: selectedJob.jobId,
            jobTitle: selectedJob.title,
            skills,
        });

        res.status(201).json(ResponseGenerator.sendSuccess(newSkillDoc, "Skill analysis completed and saved"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, error.message, "Analysis failed"));
    }
};


// --- READ: Get User Dashboard ---
export const getMySavedSkills = async (req, res) => {
    const userId = req.user.email;

    try {
        const mySkills = await SkillModel.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(ResponseGenerator.sendSuccess(mySkills, "Saved skills retrieved successfully"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch failed", error.message));
    }
};



// --- UPDATE: Edit Skill/Note/Status ---
export const updateSkillDetails = async (req, res) => {
    const { jobId, skillId } = req.params;
    const { userNote, importance, status } = req.body;
    const userId = req.user.email;

    try {
        const updatedDoc = await SkillModel.findOneAndUpdate(
            { jobId, userId, "skills._id": skillId },
            {
                $set: {
                    "skills.$.userNote": userNote,
                    "skills.$.importance": importance,
                    "skills.$.status": status
                }
            },
            { new: true }
        );

        if (!updatedDoc) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Skill not found", "Update failed"));

        res.status(200).json(ResponseGenerator.sendSuccess(updatedDoc, "Skill details updated successfully"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Update failed", error.message));
    }
};




// --- DELETE: Remove One Skill ---
export const removeSkillFromList = async (req, res) => {
    const { jobId, skillId } = req.params;
    const userId = req.user.email;

    try {
        const updatedDoc = await SkillModel.findOneAndUpdate(
            { jobId, userId },
            { $pull: { skills: { _id: skillId } } },
            { new: true }
        );

        if (!updatedDoc) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Skill not found", "Delete failed"));
        res.status(200).json(ResponseGenerator.sendSuccess(updatedDoc, "Skill removed successfully"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete skill failed", error.message));
    }
};




// --- DELETE: Full Analysis ---
export const deleteFullAnalysis = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.email;

    try {
        const deletedDoc = await SkillModel.findOneAndDelete({ jobId, userId });
        if (!deletedDoc) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Analysis not found", "Delete failed"));
        res.status(200).json(ResponseGenerator.sendSuccess(null, "Analysis removed successfully"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete analysis failed", error.message));
    }
};




// --- HELPER: Generate skills using Gemini ---
const fetchSkillsFromGemini = async (jobTitle, jobDescription) => {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
        You are a career skills analyst. Given the job title and description below, identify the most relevant and specific skills required for this role.

        Job Title: "${jobTitle}"
        Job Description: "${jobDescription || 'Not provided'}"

        Return ONLY a valid JSON array of exactly 15 skill objects (10 essential, 5 optional) in this format:
        [
          {
            "name": "skill name",
            "importance": "Essential" or "Optional",
            "description": "1-2 sentence explanation of how this skill applies to the role",
            "altLabels": ["alternative name 1", "alternative name 2"]
          }
        ]

        Rules:
        - Skills must be directly relevant to the job title and description
        - Essential skills are core requirements; optional skills are valuable but not mandatory
        - Be specific (e.g. "PyTorch model training" not just "Python")
        - Do not include soft skills like "communication" or "teamwork"
        - Return only the JSON array, no extra text
    `;

    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const text = await result.response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

            if (!Array.isArray(parsed)) throw new Error("Gemini did not return an array");

            return parsed.map(skill => ({
                name: skill.name || "Unknown Skill",
                importance: skill.importance === "Optional" ? "Optional" : "Essential",
                description: skill.description || "",
                altLabels: Array.isArray(skill.altLabels) ? skill.altLabels : [],
                userNote: "",
                status: "pending",
            }));
        } catch (err) {
            lastError = err;
            if (err.status === 429 || err.status === 503) {
                await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 2000));
                continue;
            }
            throw err;
        }
    }
    throw lastError;
};
