import { Router } from "express";
import { showEconomyDetails } from "../Controllers/economyController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/economyDetails/:countryCode", auth, showEconomyDetails);

export default router;