import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    age: { type: Number },
    industrialPreference: { type: [String] }, // skills
    background: { type: String },
    university: { type: String },
    cv: { type: String }, // CV/Resume URL
    profilePicture: { type: String, default: "" },
    
    // Additional fields from dashboard
    phone: { type: String },
    portfolio: { type: String }, // Portfolio URL
    github: { type: String }, // GitHub URL
    linkedin: { type: String }, // LinkedIn URL
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;