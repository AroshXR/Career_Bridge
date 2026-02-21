import { Router } from "express";
import { skillSearch, findProfessionalCourses, generateRoadMap, getAllSavedCoursesById } from "../Controllers/learning_resource_controller.js";

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



router.get("/get-by-id/:id", getAllSavedCoursesById);

export default router;