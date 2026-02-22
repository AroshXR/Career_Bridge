import mongoose from "mongoose";

const schema = mongoose.Schema;

const savedResourceSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Connects to Member 1's User ID
    ref: 'userModels', // Points to the model name you provided
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId, // Connects to Member 3's Skill ID
    ref: 'skillModels', // Assuming Member 3 uses this name
    required: true
  },
  videoTitle: {
    type: String, // Title fetched from YouTube API
    required: true
  },
  videoUrl: {
    type: String, // Link fetched from YouTube API
    required: true
  },
  thumbnail: {
    type: String, // Image URL from YouTube
    required: false
  },
  userEmail: {
    type: String, // Email address for the alert
    required: true
  },
  scheduledTime: {
    type: Date, // When the user wants to be notified
    required: true
  },
  priority: {
    type: String, // Level of importance
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  notes: {
    type: String, // Custom notes from the user
    required: false
  },
  isCompleted: {
    type: Boolean, // To track progress
    default: false
  }
}, { timestamps: true });


export default mongoose.model("resourceModels", savedResourceSchema);