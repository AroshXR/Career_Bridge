import mongoose from 'mongoose';

const skillModelSchema = new mongoose.Schema({
    // Links to the user who saved this analysis
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if using a User model
        required: true
    },
    // Links directly to the jobId in your SavedJobModel
    jobId: {
        type: String,
        required: true
    },
    jobTitle: String,
    // The curated list of skills
    skills: [
        {
            name: { type: String, required: true },
            uri: String,        // ESCO identifier
            importance: String, // 'Essential' or 'Optional'
            description: String,
            altLabels: [String],
            userNote: { type: String, default: "" } // For the 'Edit' feature
        }
    ],
    roadmap: [
        {
            skillName: String,
            resourceName: String,
            resourceUrl: String,
            status: { type: String, default: "pending" } // To track progress
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index ensures a user can only have one unique analysis per job
skillModelSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SkillModel = mongoose.model('SkillModel', skillModelSchema);
export default SkillModel;