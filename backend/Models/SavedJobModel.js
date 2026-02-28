import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: false // Multiple users can save the same job
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    notes: {
        type: String,
        default: ''
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent the same user from saving the same job multiple times
savedJobSchema.index({ jobId: 1, username: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJobModel', savedJobSchema);

export default SavedJob;
