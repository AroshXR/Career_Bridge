import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getApprovedFeedbacks,
  updateFeedback,
  deleteFeedback,
  approveFeedback,
  rejectFeedback
} from '../Controllers/feedbackController.js';
import authMiddleware, { optionalAuth } from '../middleware/auth.js';
import adminAuthMiddleware from '../middleware/adminAuth.js';

const router = express.Router();

// Publicly visible approved feedbacks
router.get('/public', getApprovedFeedbacks);

// User specific routes - Support both guest and logged-in
router.post('/', optionalAuth, createFeedback);
router.put('/:id', authMiddleware, updateFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);

// Admin specific routes
router.get('/', adminAuthMiddleware, getAllFeedbacks);
router.patch('/:id/approve', adminAuthMiddleware, approveFeedback);
router.patch('/:id/reject', adminAuthMiddleware, rejectFeedback);

export default router;
