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

    // ✅ New Profile Picture Field
    profilePicture: {
      type: String, // store image URL or file path
      default: "",
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;