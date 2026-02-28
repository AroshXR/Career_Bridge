import axios from "axios";
import process from "process";
import SkillModel from "../Models/SkillModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";
import SavedJob from "../Models/SavedJobModel.js";





// --- CREATE: Analyze and Save ---
export const analyzeAndSaveSkills = async (req, res) => {
    const { jobId } = req.params; 
    const userEmail = req.user.email; // Consistent with your Trending Controller

    try {
        // Check if this specific job analysis already exists for this user
        let existingSkillDoc = await SkillModel.findOne({ jobId, userId: userEmail });
        if (existingSkillDoc) return res.status(200).json(existingSkillDoc);

        // FETCH FROM DATABASE instead of MOCK_JOBS
        // We look for the job in the SavedJobModel collection
        const selectedJob = await SavedJob.findOne({ jobId: jobId, username: userEmail });
        
        if (!selectedJob) {
            return res.status(404).json({ message: "Job not found in your saved list" });
        }

        // Use the title from the DB to fetch ESCO skills
        const { essential, optional } = await fetchSkillsFromEsco(selectedJob.title);

        const enrichData = async (list) => await Promise.all(
            list.map(async (skill) => ({ 
                ...skill, 
                ...(await fetchSkillResourceDetails(skill.uri)),
                userNote: "",
                status: "pending" 
            }))
        );

        // Create the analysis document using data from the database
        const newSkillDoc = await SkillModel.create({
            userId: userEmail,
            jobId: selectedJob.jobId,
            jobTitle: selectedJob.title,
            skills: [
                ...(await enrichData(essential)), 
                ...(await enrichData(optional))
            ],
        });
       
        res.status(201).json(newSkillDoc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- READ: Get User Dashboard ---
export const getMySavedSkills = async (req, res) => {
    //Extracts userId from the URL parameters
    const { userId } = req.params;

    try {
        //Queries the DB for all skill documents associated with that userId
        const mySkills = await SkillModel.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(mySkills);
    } catch (error) {
        res.status(500).json({ error: "Fetch failed" });
    }
};



// --- UPDATE: Edit Skill/Note/Status ---
export const updateSkillDetails = async (req, res) => {
    //Extracts jobId and skillId from the URL parameters
    const { jobId, skillId } = req.params;
    //Extracts more data from the body of the request
    const { userNote, importance, status, userId } = req.body;

    //checks if userId is provided in the request body
    if (!userId) return res.status(400).json({ message: "userId is required" });

    //Finds the specific skill within the skills array of the relevant document and updates it.
    try {
        const updatedDoc = await SkillModel.findOneAndUpdate(
            { jobId, userId, "skills._id": skillId },
            {
                $set: {
                    "skills.$.userNote": userNote,
                    "skills.$.importance": importance,
                    "skills.$.status": status // Allows marking as 'completed' or 'pending'
                }
            },
            { new: true }
        );

        if (!updatedDoc) return res.status(404).json({ message: "Skill not found" });

        res.status(200).json(updatedDoc);
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};




// --- DELETE: Remove One Skill ---
export const removeSkillFromList = async (req, res) => {
    //Extracts jobId and skillId from the URL parameters
    const { jobId, skillId } = req.params;
    //Extracts userId from the query parameters
    const userId = req.query.userId;

    //checks if userId is provided in the query parameers
    if (!userId) return res.status(400).json({ message: "userId is required" });

    //Finds the specific skill within the skills array and removes it 
    try {
        const updatedDoc = await SkillModel.findOneAndUpdate(
            { jobId, userId },
            { $pull: { skills: { _id: skillId } } },
            { new: true }
        );

        //If the skill or document isn't found, it returns a 404 error. Otherwise, it returns the updated document with the skill removed.
        if (!updatedDoc) return res.status(404).json({ message: "Skill not found" });
        res.status(200).json(updatedDoc);
    } catch (error) {
        res.status(500).json({ error: "Delete skill failed" });
    }
};




// --- DELETE: Full Analysis ---
export const deleteFullAnalysis = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.query.userId;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    try {
        const deletedDoc = await SkillModel.findOneAndDelete({ jobId, userId });
        if (!deletedDoc) return res.status(404).json({ message: "Analysis not found" });
        res.status(200).json({ message: "Analysis removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Delete analysis failed" });
    }
};




// --- HELPERS ---

const fetchSkillsFromEsco = async (jobTitle) => {
    const searchUrl = `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(jobTitle)}&type=occupation&language=en`;
    const searchRes = await axios.get(searchUrl);
    const occupation = searchRes.data?._embedded?.results?.[0];

    if (!occupation) return { essential: [], optional: [] };

    const profileRes = await axios.get(occupation._links.self.href);
    const links = profileRes.data._links;

    const process = (list, importance) =>
        list?.map((s) => ({
            name: s.title,
            uri: s.uri,
            importance: importance,
        })) || [];

    return {
        essential: process(links.hasEssentialSkill, "Essential").slice(0, 10),
        optional: process(links.hasOptionalSkill, "Optional").slice(0, 10),
    };
};



const fetchSkillResourceDetails = async (uri) => {
    try {
        const resourceUrl = `https://ec.europa.eu/esco/api/resource/skill?uri=${encodeURIComponent(uri)}&language=en`;
        const res = await axios.get(resourceUrl);
        return {
            description: res.data.description?.en?.literal || "No description available.",
            altLabels: res.data.alternativeLabel?.en || [],
            reuseLevel: res.data.reuseLevel || "sector-specific"
        };
    } catch (error) {
        return { description: "Details unavailable.", altLabels: [], reuseLevel: "unknown" };
    }
};