/**
 * @swagger
 * /api/v1/trendingJobAnalyzer/getTrendingJobs:
 *   get:
 *     summary: Get trending jobs based on user preference
 *     description: Fetches trending jobs from consolidated market signals.
 *     tags: [TrendingJobAnalyzer]
 *     responses:
 *       200:
 *         description: A list of trending jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "00"
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                 description:
 *                   type: string
 *                 error:
 *                   type: object
 *       500:
 *         description: Server Error
 * 
 * /api/v1/trendingJobAnalyzer/saveJob:
 *   post:
 *     summary: Save a job role
 *     tags: [TrendingJobAnalyzer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, title, description, username, company, location]
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: "job_123"
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               description:
 *                 type: string
 *                 example: "Developing web applications using React and Node.js"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               location:
 *                 type: string
 *                 example: "Remote"
 *           example:
 *             jobId: "job98765"
 *             title: "Full Stack Developer"
 *             description: "Building scalable backend services and responsive UIs."
 *             username: "Aroshana"
 *             company: "Skill Bridge"
 *             location: "Colombo, Sri Lanka"
 *     responses:
 *       201:
 *         description: Job saved successfully
 * 
 * /api/v1/trendingJobAnalyzer/getSavedJobs/{username}:
 *   get:
 *     summary: Get saved jobs for a user
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of saved jobs
 * 
 * /api/v1/trendingJobAnalyzer/updateSavedJob/{id}:
 *   put:
 *     summary: Update a saved job
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               notes:
 *                 type: string
 *                 example: "Revised the system design concepts."
 *                 description: Career notes or interview preparation details
 *           example:
 *             notes: "Practiced coding interview questions."
 *     responses:
 *       200:
 *         description: Job updated successfully
 * 
 * /api/v1/trendingJobAnalyzer/deleteSavedJob/{id}:
 *   delete:
 *     summary: Delete a saved job
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
