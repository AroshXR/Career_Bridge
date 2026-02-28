import User from "../Models/User.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

/**
 * Analyzes a user's progress across all courses.
 * returns total courses, completion rate, and average score.
 */
export const analyzeUserProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "User not found", "Progress analysis failed"));
        }

        const progress = user.progress || [];
        const totalCourses = progress.length;

        if (totalCourses === 0) {
            return res.status(200).json(ResponseGenerator.sendSuccess({
                userId: user.userId,
                name: user.name,
                summary: "No progress data available",
                stats: {
                    totalCourses: 0,
                    completedCourses: 0,
                    completionRate: 0,
                    averageScore: 0
                }
            }, "No progress data available"));
        }

        const completedCourses = progress.filter(p => p.status === "Completed").length;
        const totalScore = progress.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const averageScore = totalScore / totalCourses;
        const completionRate = (completedCourses / totalCourses) * 100;

        res.status(200).json(ResponseGenerator.sendSuccess({
            userId: user.userId,
            name: user.name,
            stats: {
                totalCourses,
                completedCourses,
                completionRate: completionRate.toFixed(2) + "%",
                averageScore: averageScore.toFixed(2)
            },
            detailedProgress: progress
        }, "User progress analyzed successfully"));
    } catch (error) {
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Progress analysis failed", error.message));
    }
};
