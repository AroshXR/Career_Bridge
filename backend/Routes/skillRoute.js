import express from 'express';
import {
    analyzeAndSaveSkills,
    getMySavedSkills,
    updateSkillDetails,
    removeSkillFromList,
    deleteFullAnalysis
} from '../Controllers/JobSkillAnalyzerController.js';

const router = express.Router();

router.post("/analyze/:jobId", analyzeAndSaveSkills);

router.get("/user/:userId", getMySavedSkills);

router.patch("/:jobId/:skillId", updateSkillDetails);

router.delete("/:jobId/:skillId", removeSkillFromList);

router.delete("/:jobId", deleteFullAnalysis);

export default router;