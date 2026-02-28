/**
 * @swagger
 * tags:
 *   name: Progress Tracking
 *   description: Skill learning progress and task management
 */

/**
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Start learning a new skill
 *     tags: [Progress Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - skillId
 *               - skillName
 *               - tasks
 *             properties:
 *               userId: { type: string }
 *               skillId: { type: string }
 *               skillName: { type: string }
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title: { type: string }
 *                     resourceLink: { type: string }
 *     responses:
 *       201:
 *         description: Progress record created
 */

/**
 * @swagger
 * /api/progress/user/{userId}:
 *   get:
 *     summary: Get all progress records for a user
 *     tags: [Progress Tracking]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user progress
 */

/**
 * @swagger
 * /api/progress/complete-task:
 *   put:
 *     summary: Mark a specific task as completed
 *     tags: [Progress Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - progressId
 *               - taskIndex
 *             properties:
 *               progressId: { type: string }
 *               taskIndex: { type: integer }
 *     responses:
 *       200:
 *         description: Task updated successfully
 */

/**
 * @swagger
 * /api/progress/reminder/send:
 *   get:
 *     summary: Manually trigger reminder emails
 *     tags: [Progress Tracking]
 *     responses:
 *       200:
 *         description: Reminders processed
 */
