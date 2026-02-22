import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        birthday: { type: Date },
        age: { type: Number },
        industrialPreference: { type: [String] },
        background: { type: String },
        university: { type: String },
        cv: { type: String },
        // Progress tracking fields
        progress: [
            {
                courseId: { type: String, required: true },
                courseName: { type: String },
                status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" },
                score: { type: Number, default: 0 },
                completionPercentage: { type: Number, default: 0 },
                lastUpdated: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
