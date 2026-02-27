import { Router } from "express";
import auth from "../middleware/auth.js";
import { skillSearch, findProfessionalCourses, generateRoadMap, getAllSavedCoursesById, saveResource, updateSaveResource, deleteSavedResources } from "../Controllers/learning_resource_controller.js";

const router = Router();

router.get("/search_resource/:skill", auth, skillSearch);
router.get("/search_professional/:skill", auth, findProfessionalCourses);
router.get("/roadmap/:skill", auth, generateRoadMap);
router.get("/get-by-id/:userId", auth, getAllSavedCoursesById);
router.post("/save-resource", auth, saveResource);
router.put("/update-save-resource", auth, updateSaveResource);
router.delete("/resource-delete/:id", auth, deleteSavedResources);

export default router;