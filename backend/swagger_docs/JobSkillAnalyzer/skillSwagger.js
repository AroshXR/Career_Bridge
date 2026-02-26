/**
 * @swagger
 * /api/v1/skills/analyze/{jobId}:
 *   post:
 *     summary: Analyze and save job skills
 *     tags: [JobSkillAnalyzer]
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
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skills analyzed and saved successfully
 * 
 * /api/v1/skills/user/{userId}:
 *   get:
 *     summary: Get all saved skills for a user
 *     tags: [JobSkillAnalyzer]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 * 
 * /api/v1/skills/{jobId}/{skillId}:
 *   patch:
 *     summary: Update skill details
 *     tags: [JobSkillAnalyzer]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *       - in: path
 *         name: skillId
 *         required: true
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *   delete:
 *     summary: Remove skill from list
 *     tags: [JobSkillAnalyzer]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *       - in: path
 *         name: skillId
 *         required: true
 *     responses:
 *       200:
 *         description: Skill removed successfully
 * 
 * /api/v1/skills/{jobId}:
 *   delete:
 *     summary: Delete full analysis for a job
 *     tags: [JobSkillAnalyzer]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *     responses:
 *       200:
 *         description: Analysis deleted successfully
 */
