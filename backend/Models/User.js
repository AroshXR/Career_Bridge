import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


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

    // Role and Status
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'blocked', 'pending'], default: 'active' },

    // Additional fields from dashboard
    phone: { type: String, default: "" },
    education: { type: String, default: "" },      // Added
    experience: { type: String, default: "" },      // Added
    location: { type: String, default: "" },
    title: { type: String, default: "" },
    bio: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    cvDetails: {
      professionalSummary: { type: String },
      education: [{
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String
      }],
      experience: [{
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
        achievements: [String]
      }],
      skills: [{
        name: String,
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
      }],
      languages: [{
        name: String,
        proficiency: { type: String, enum: ['Basic', 'Conversational', 'Professional', 'Native'] }
      }],
      certifications: [{
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        credentialUrl: String
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        githubLink: String,
        liveLink: String
      }],
      achievements: [{
        title: String,
        description: String,
        date: Date
      }]
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Make sure this export is correct
const User = mongoose.model("User", userSchema);
export default User;  // This must be exactly this