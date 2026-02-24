import express from 'express';
import { 
    analyzeAndSaveSkills, 
    getMySavedSkills, 
    updateSkillDetails, 
    removeSkillFromList, 
    deleteFullAnalysis 
} from '../Controllers/JobSkillAnalyzerController.js';

const router = express.Router();

/**
 * @openapi
 * /api/v1/skills/analyze/{jobId}:
 *   post:
 *     summary: Analyze and save job skills
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Skills analyzed and saved successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/analyze/:jobId", analyzeAndSaveSkills);

/**
 * @openapi
 * /api/v1/skills/user/{userId}:
 *   get:
 *     summary: Get all saved skills for a user
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 *       404:
 *         description: No skills found
 */
router.get("/user/:userId", getMySavedSkills);

/**
 * @openapi
 * /api/v1/skills/{jobId}/{skillId}:
 *   patch:
 *     summary: Update skill details
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userNote:
 *                 type: string
 *                 example: "Practice this using LeetCode"
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not found
 */
router.patch("/:jobId/:skillId", updateSkillDetails);

/**
 * @openapi
 * /api/v1/skills/{jobId}/{skillId}:
 *   delete:
 *     summary: Remove skill from list
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *       404:
 *         description: Skill not found
 */
router.delete("/:jobId/:skillId", removeSkillFromList);

/**
 * @openapi
 * /api/v1/skills/{jobId}:
 *   delete:
 *     summary: Delete full analysis for a job
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis deleted successfully
 *       404:
 *         description: Analysis not found
 */
router.delete("/:jobId", deleteFullAnalysis);

export default router;