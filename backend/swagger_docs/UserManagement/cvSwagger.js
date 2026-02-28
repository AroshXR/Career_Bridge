/**
 * @swagger
 * tags:
 *   name: CV Management
 *   description: CV generation, saving, and import management
 */

/**
 * @swagger
 * /api/v1/users/cv/generate:
 *   post:
 *     summary: Generate a professional CV PDF
 *     tags: [CV Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   email: { type: string }
 *                   phone: { type: string }
 *                   summary: { type: string }
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: PDF file generated
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/v1/users/cv/save:
 *   post:
 *     summary: Save CV details to user profile
 *     tags: [CV Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: CV details saved
 */

/**
 * @swagger
 * /api/v1/users/cv/my-cv:
 *   get:
 *     summary: Get current user's saved CV data
 *     tags: [CV Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched CV data
 */

/**
 * @swagger
 * /api/v1/users/cv/import/github:
 *   post:
 *     summary: Import profile data from GitHub
 *     tags: [CV Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - githubUsername
 *             properties:
 *               githubUsername:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data imported successfully from GitHub
 */

/**
 * @swagger
 * /api/v1/users/cv/skills/{jobRole}:
 *   get:
 *     summary: Get skill suggestions for a job role
 *     tags: [CV Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobRole
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of suggested skills
 */
