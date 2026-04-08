import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: false, // Optional — AI-generated roadmaps don't have a Skill document
    },

    skillName: {
      type: String,
      required: true,
    },

    tasks: [
      {
        title: String,
        resourceLink: String, // external link (GeeksforGeeks etc.)
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    progressPercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },

    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    nextReminderDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;

//progress