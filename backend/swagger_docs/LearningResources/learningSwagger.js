/**
 * @swagger
 * /api/v1/resources/search_resource/{skill}:
 *   get:
 *     summary: Search for YouTube learning tutorials
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of YouTube videos
 * 
 * /api/v1/resources/search_professional/{skill}:
 *   get:
 *     summary: Find professional courses from Dailymotion
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of professional courses
 * 
 * /api/v1/resources/roadmap/{skill}:
 *   get:
 *     summary: Generate an AI learning roadmap
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A 10-step learning roadmap
 */
