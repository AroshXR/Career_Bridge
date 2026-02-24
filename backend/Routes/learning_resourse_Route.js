import { Router } from "express";
import { skillSearch, findProfessionalCourses, generateRoadMap, getAllSavedCoursesById, saveResource, updateSaveResource, deleteSavedResources } from "../Controllers/learning_resource_controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/resources/search_resource/{skill}:
 *   get:
 *     summary: Search for YouTube learning tutorials
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *         description: The skill to search for (e.g., javascript)
 *     responses:
 *       200:
 *         description: A list of YouTube videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   videoId: { type: string }
 *                   title: { type: string }
 *                   description: { type: string }
 *                   thumbnail: { type: string }
 *                   videoUrl: { type: string }
 *       500:
 *         description: Error fetching from YouTube
 */
router.get("/search_resource/:skill", skillSearch);

/**
 * @swagger
 * /api/v1/resources/search_professional/{skill}:
 *   get:
 *     summary: Find professional courses from Dailymotion
 *     tags: [Resources]
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title: { type: string }
 *                   thumbnail: { type: string }
 *                   videoUrl: { type: string }
 *                   duration: { type: string }
 *                   platform: { type: string }
 *                   price: { type: string }
 */
router.get("/search_professional/:skill", findProfessionalCourses);

/**
 * @swagger
 * /api/v1/resources/roadmap/{skill}:
 *   get:
 *     summary: Generate an AI learning roadmap
 *     tags: [Resources]
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
 *               type: object
 *               properties:
 *                 skill: { type: string }
 *                 roadmap:
 *                   type: array
 *                   items: { type: string }
 *       500:
 *         description: AI generation failed
 */
router.get("/roadmap/:skill", generateRoadMap);



router.get("/get-by-id/:userId", getAllSavedCoursesById);

/**
 * @swagger
 * /api/v1/resources/save-resource:
 *   post:
 *     summary: Save a learning resource (video) for a user
 *     tags: [Resources]
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
 *               - videoTitle
 *               - videoUrl
 *               - userEmail
 *               - scheduledTime
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
 *       201:
 *         description: Resource saved successfully
 *       400:
 *         description: Required fields are missing
 *       500:
 *         description: Server error while saving resource
 */
router.post("/save-resource", saveResource);


router.put("/update-save-resource", updateSaveResource);



router.delete("/resource-delete/:id", deleteSavedResources);

export default router;