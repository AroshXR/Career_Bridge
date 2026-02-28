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
 * /api/v1/resources/get-by-id/{userId}:
 *   get:
 *     summary: Retrieve all saved courses for a specific user
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of saved courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: No saved courses found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server Error
 * 
 * /api/v1/resources/save-resource:
 *   post:
 *     summary: Save a new learning resource
 *     tags: [LearningResources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, skillId, skillName, videoTitle, videoUrl, userEmail, scheduledTime]
 *             properties:
 *               userId: { type: string }
 *               skillId: { type: string }
 *               skillName: { type: string }
 *               videoTitle: { type: string }
 *               videoUrl: { type: string }
 *               thumbnail: { type: string }
 *               userEmail: { type: string }
 *               scheduledTime: { type: string, format: date-time }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Resource saved successfully
 *       400:
 *         description: Bad Request - Missing required fields
 *       500:
 *         description: Server Error
 * 
 * /api/v1/resources/update-save-resource:
 *   put:
 *     summary: Update an existing saved resource
 *     tags: [LearningResources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: string, description: "Resource ID (_id)" }
 *               userEmail: { type: string }
 *               scheduledTime: { type: string, format: date-time }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               notes: { type: string }
 *               isCompleted: { type: boolean }
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Bad Request - Missing ID
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server Error
 * 
 * /api/v1/resources/resource-delete/{id}:
 *   delete:
 *     summary: Delete a saved resource by ID
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resource successfully deleted
 *       400:
 *         description: Bad Request - Missing ID
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server Error
 */
