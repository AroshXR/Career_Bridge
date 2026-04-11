import process from "process";
import axios from "axios";
import SkillModel from "../Models/SkillModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";
import SavedJob from "../Models/SavedJobModel.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama-3.3-70b-versatile"; // 1,000 req/day free — best quality
// Fallback: "llama-3.1-8b-instant"             // 14,400 req/day free — faster


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

        // Generate skills using Groq (Llama 3)
        const skills = await fetchSkillsFromGroq(selectedJob.title, selectedJob.description);

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


// --- HELPER: Generate skills using Groq (Llama 3) ---
const fetchSkillsFromGroq = async (jobTitle, jobDescription) => {
    const prompt = `You are a career skills analyst. Given the job title and description below, identify the most relevant and specific technical skills required for this role.

Job Title: "${jobTitle}"
Job Description: "${jobDescription || "Not provided"}"

Return ONLY a valid JSON array of exactly 15 skill objects (10 essential, 5 optional) with no extra text, markdown, or explanation.

Format:
[
  {
    "name": "skill name",
    "importance": "Essential",
    "description": "1-2 sentence explanation of how this skill applies to the role",
    "altLabels": ["alternative name 1", "alternative name 2"]
  }
]

Rules:
- Skills must be specific and directly relevant to the job title and description
- Essential: core technical requirements the candidate must have
- Optional: valuable but not mandatory skills that give a competitive edge
- Be specific (e.g. "PyTorch model training" not just "Python")
- Do not include soft skills like "communication" or "teamwork"
- Return only the raw JSON array`;

    const response = await axios.post(
        GROQ_API_URL,
        {
            model: GROQ_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 2048,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    const text = response.data.choices[0]?.message?.content || "";

    // Strip any accidental markdown code fences
    const cleaned = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Groq did not return a valid JSON array");

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) throw new Error("Parsed response is not an array");

    return parsed.map(skill => ({
        name:       skill.name        || "Unknown Skill",
        importance: skill.importance === "Optional" ? "Optional" : "Essential",
        description: skill.description || "",
        altLabels:  Array.isArray(skill.altLabels) ? skill.altLabels : [],
        userNote:   "",
        status:     "pending",
    }));
};
