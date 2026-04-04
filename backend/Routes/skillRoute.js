import express from 'express';
import auth from '../middleware/auth.js';
import {
    analyzeAndSaveSkills,
    getMySavedSkills,
    updateSkillDetails,
    removeSkillFromList,
    deleteFullAnalysis
} from '../Controllers/JobSkillAnalyzerController.js';

const router = express.Router();

router.post("/analyze/:jobId", auth, analyzeAndSaveSkills);
router.get("/user/me", auth, getMySavedSkills);
router.patch("/:jobId/:skillId", auth, updateSkillDetails);
router.delete("/:jobId/:skillId", auth, removeSkillFromList);
router.delete("/:jobId", auth, deleteFullAnalysis);

export default router;