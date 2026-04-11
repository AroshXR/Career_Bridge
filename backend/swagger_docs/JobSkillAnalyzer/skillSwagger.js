/**
 * @swagger
 * /api/v1/skills/analyze/{jobId}:
 *   post:
 *     summary: Analyze and save job skills
 *     description: Analyzes skills for a job saved in the user's list. The logged-in user is identified automatically from the Bearer token.
 *     tags: [JobSkillAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: trend_software_engineer
 *     responses:
 *       200:
 *         description: Analysis already exists for this job
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       201:
 *         description: Skills analyzed and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found in saved list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/skills/user/me:
 *   get:
 *     summary: Get all saved skill analyses for the logged-in user
 *     description: Returns all skill analysis documents belonging to the authenticated user. No userId input required.
 *     tags: [JobSkillAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/skills/{jobId}/{skillId}:
 *   patch:
 *     summary: Update a skill's note, importance, or status
 *     description: Updates a specific skill within a job analysis. The logged-in user is identified automatically from the Bearer token.
 *     tags: [JobSkillAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: trend_software_engineer
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64b1f2c3e4b0a12345678901
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userNote:
 *                 type: string
 *                 example: Need to practice this more
 *               importance:
 *                 type: string
 *                 enum: [Essential, Optional]
 *                 example: Essential
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Skill not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Remove a single skill from a job analysis
 *     description: Removes a specific skill from the analysis. The logged-in user is identified automatically from the Bearer token.
 *     tags: [JobSkillAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: trend_software_engineer
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64b1f2c3e4b0a12345678901
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Skill not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/skills/{jobId}:
 *   delete:
 *     summary: Delete the full skill analysis for a job
 *     description: Deletes all skill analysis data for a given job. The logged-in user is identified automatically from the Bearer token.
 *     tags: [JobSkillAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: trend_software_engineer
 *     responses:
 *       200:
 *         description: Analysis deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Analysis not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
