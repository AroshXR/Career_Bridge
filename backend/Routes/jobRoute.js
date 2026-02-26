import express from "express";
import { getTrendingJobs, saveJob, getSavedJobs, updateSavedJob, deleteSavedJob } from '../Controllers/TrendingJobAnalyzerController.js';

const router = express.Router();

// Route to get trending jobs
router.get('/getTrendingJobs', getTrendingJobs);

// Route to save a job
router.post('/saveJob', saveJob);

// Route to get saved jobs for a specific user
router.get('/getSavedJobs/:username', getSavedJobs);

// Route to update a saved job
router.put('/updateSavedJob/:id', updateSavedJob);

// Route to delete a saved job
router.delete('/deleteSavedJob/:id', deleteSavedJob);

export default router;
