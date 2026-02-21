import express from "express";
import { getTrendingJobs } from '../Controllers/TrendingJobAnalyzerController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/jobs/trending:
 *   get:
 *     summary: Get trending jobs based on user preference
 *     description: Fetches trending jobs from Adzuna API that match the dummy user's preferred field.
 *     responses:
 *       200:
 *         description: A list of trending jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     preferredField:
 *                       type: string
 *                 count:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       company:
 *                         type: string
 *                       field:
 *                         type: string
 *                       location:
 *                         type: string
 *                       description:
 *                         type: string
 *                       url:
 *                         type: string
 *                       salary_min:
 *                         type: number
 *                       salary_max:
 *                         type: number
 *       500:
 *         description: Server Error
 */
// Route to get trending jobs based on user preference
router.get('/trending', getTrendingJobs);

export default router;
