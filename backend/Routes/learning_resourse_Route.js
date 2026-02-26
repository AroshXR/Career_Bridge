import { Router } from "express";
import { skillSearch, findProfessionalCourses, generateRoadMap, getAllSavedCoursesById, saveResource, updateSaveResource, deleteSavedResources } from "../Controllers/learning_resource_controller.js";

const router = Router();

router.get("/search_resource/:skill", skillSearch);

router.get("/search_professional/:skill", findProfessionalCourses);

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