import express from "express";
import auth from "../middleware/auth.js";
import { getTrendingJobs, saveJob, getSavedJobs, updateSavedJob, deleteSavedJob } from '../Controllers/TrendingJobAnalyzerController.js';

const router = express.Router();

// Route to get trending jobs
router.get('/getTrendingJobs', auth, getTrendingJobs);

// Route to save a job
router.post('/saveJob', auth, saveJob);

// Route to get saved jobs for a specific user
router.get('/getSavedJobs', auth, getSavedJobs);

// Route to update a saved job
router.put('/updateSavedJob/:id', auth, updateSavedJob);

// Route to delete a saved job
router.delete('/deleteSavedJob/:id', auth, deleteSavedJob);

export default router;
