import { Router } from "express";
import { skillSearch, findProfessionalCourses, generateRoadMap, getAllSavedCoursesById } from "../Controllers/learning_resource_controller.js";

const router = Router();

router.get("/search_resource/:skill", skillSearch);

router.get("/search_professional/:skill", findProfessionalCourses);

router.get("/roadmap/:skill", generateRoadMap);



router.get("/get-by-id/:id", getAllSavedCoursesById);

export default router;