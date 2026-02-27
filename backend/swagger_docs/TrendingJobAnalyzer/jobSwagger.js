/**
 * @swagger
 * /api/v1/trendingJobAnalyzer/getTrendingJobs:
 *   get:
 *     summary: Get trending jobs based on user preference
 *     description: Fetches trending jobs from consolidated market signals.
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: query
 *         name: category
 *         description: The job category to analyze
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - Information Technology
 *             - Health Care
 *             - Finance
 *             - Engineering
 *             - Marketing
 *             - Education
 *             - Business Management
 *             - Creative Arts
 *             - Hospitality
 *     responses:
 *       200:
 *         description: A list of trending jobs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         meta:
 *                           type: object
 *                           properties:
 *                             category: { type: 'string' }
 *                             timestamp: { type: 'string', format: 'date-time' }
 *                             cached: { type: 'boolean' }
 *                         stats:
 *                           type: object
 *                           properties:
 *                             totalMarketSignals: { type: 'number' }
 *                             analyzedRoles: { type: 'number' }
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title: { type: 'string' }
 *                               description: { type: 'string' }
 *                               key_skills: { type: 'array', items: { type: 'string' } }
 *                               demand_level: { type: 'string' }
 *                               average_salary: { type: 'string' }
 *                               growth_factor: { type: 'string' }
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request (e.g., duplicate job)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * /api/v1/trendingJobAnalyzer/getSavedJobs:
 *   get:
 *     summary: Get saved jobs for the logged-in user
 *     tags: [TrendingJobAnalyzer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved jobs
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
 * /api/v1/trendingJobAnalyzer/updateSavedJob/{id}:
 *   put:
 *     summary: Update a saved job
 *     description: Updates notes for a specific saved job using its database ID.
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique Database ID (_id) of the saved job
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
 *         description: Job not found
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
 * /api/v1/trendingJobAnalyzer/deleteSavedJob/{id}:
 *   delete:
 *     summary: Delete a saved job
 *     description: Removes a specific saved job using its database ID.
 *     tags: [TrendingJobAnalyzer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique Database ID (_id) of the saved job
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *         description: Job not found
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
