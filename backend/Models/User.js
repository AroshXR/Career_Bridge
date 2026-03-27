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

const User = mongoose.model("User", userSchema);
export default User;