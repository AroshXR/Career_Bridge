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
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  userEmail: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  notes: {
    type: String,
    required: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


export default mongoose.model("resourceModels", savedResourceSchema);