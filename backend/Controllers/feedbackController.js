import Feedback from "../Models/feedbackModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

// Helper function to generate next feedback_id
const generateNextFeedbackId = async () => {
  try {
    const lastFeedback = await Feedback.findOne().sort({ createdAt: -1 });

    if (!lastFeedback || !lastFeedback.feedback_id) {
      return "FB-1001";
    }

    const lastId = lastFeedback.feedback_id;
    if (lastId.startsWith("FB-")) {
      const num = parseInt(lastId.split("-")[1]);
      if (isNaN(num)) return "FB-1001";
      return `FB-${num + 1}`;
    }

    return "FB-1001";
  } catch (error) {
    console.error("Error generating feedbackId:", error);
    return "FB-1001";
  }
};

// @desc    Get all feedbacks (Admin only)
// @route   GET /api/v1/feedback
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "No feedbacks found yet", "Feedback list empty"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(feedbacks, "Successfully retrieved all feedbacks"));
  } catch (err) {
    console.error("Error fetching feedbacks:", err.message);
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while fetching feedbacks", err.message));
  }
};

// @desc    Get all approved feedbacks (Public/Users)
// @route   GET /api/v1/feedback/public
export const getApprovedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ status: 'approved' }).sort({ createdAt: -1 });

    res.status(200).json(ResponseGenerator.sendSuccess(feedbacks, "Successfully retrieved approved feedbacks"));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while fetching approved feedbacks", err.message));
  }
};

// @desc    Create feedback (Public)
// @route   POST /api/v1/feedback
export const createFeedback = async (req, res) => {
  try {
    const { rating, note, name, email } = req.body;

    if (!rating || !note) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Rating and note are required", "Validation Error"));
    }

    const feedback_id = await generateNextFeedbackId();

    // Determine user details (Auth vs Guest)
    const userId = req.user ? req.user.id : null;
    const userName = req.user ? (req.user.name || "User") : (name || "Guest");
    const userEmail = req.user ? req.user.email : (email || "anonymous@example.com");

    const newFeedback = new Feedback({
      feedback_id,
      userId,
      userName,
      userEmail,
      rating,
      note,
      status: 'pending' // Initial status is pending
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(ResponseGenerator.sendSuccess(savedFeedback, "Feedback submitted successfully. Waiting for admin approval."));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while creating feedback", err.message));
  }
};

// @desc    Update feedback (within 24 hours)
// @route   PUT /api/v1/feedback/:id
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, note } = req.body;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Feedback not found", "Feedback NOT Found"));
    }

    // Check ownership
    if (feedback.userId.toString() !== req.user.id) {
      return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, "Not authorized to update this feedback", "AUTH_ERROR"));
    }

    // Check time limit (24 hours = 24 * 60 * 60 * 1000 ms)
    const timeDiff = Date.now() - new Date(feedback.createdAt).getTime();
    const limit = 24 * 60 * 60 * 1000;

    if (timeDiff > limit) {
      return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Update time limit (24 hours) has expired", "TIME_LIMIT_EXPIRED"));
    }

    feedback.rating = rating || feedback.rating;
    feedback.note = note || feedback.note;
    feedback.status = 'pending'; // Reset to pending if updated? Or keep as is? 
    // Usually, updates should trigger re-approval.
    
    const updatedFeedback = await feedback.save();
    res.status(200).json(ResponseGenerator.sendSuccess(updatedFeedback, "Feedback updated successfully and pending re-approval."));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while updating feedback", err.message));
  }
};

// @desc    Delete feedback
// @route   DELETE /api/v1/feedback/:id
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Feedback not found", "Feedback NOT Found"));
    }

    // Check ownership or admin
    if (feedback.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, "Not authorized to delete this feedback", "AUTH_ERROR"));
    }

    await Feedback.findByIdAndDelete(id);
    res.status(200).json(ResponseGenerator.sendSuccess(null, "Feedback deleted successfully"));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while deleting feedback", err.message));
  }
};

// @desc    Approve feedback (Admin only)
// @route   PATCH /api/v1/feedback/:id/approve
export const approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    if (!feedback) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Feedback not found", "Feedback NOT Found"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(feedback, "Feedback approved successfully"));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while approving feedback", err.message));
  }
};

// @desc    Reject feedback (Delete) (Admin only)
// @route   PATCH /api/v1/feedback/:id/reject
export const rejectFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "Feedback not found", "Feedback NOT Found"));
    }

    res.status(200).json(ResponseGenerator.sendSuccess(null, "Feedback rejected and deleted from database"));
  } catch (err) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Server error while rejecting feedback", err.message));
  }
};
