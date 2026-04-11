import User from "../Models/User.js";
import Progress from "../Models/Progress.js";
import SavedJob from "../Models/SavedJobModel.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

/**
 * Get aggregated statistics for the Admin Dashboard
 * Returns user growth, skill trends, and system-wide counts
 */
export const getAdminStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalUsers = await User.countDocuments();
        const activeUsersCount = await User.countDocuments({ status: 'active' });
        const blockedUsersCount = await User.countDocuments({ status: 'blocked' });
        const totalRoadmaps = await Progress.countDocuments();
        const totalSavedJobs = await SavedJob.countDocuments();

        // 2. User Growth (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Skill Trends (Top 5 skills being learned)
        const skillTrends = await Progress.aggregate([
            {
                $group: {
                    _id: "$skillName",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 } // Top 6 for better grid layout
        ]);

        // 4. System Interactions (Updated in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentInteractions = await User.countDocuments({
            updatedAt: { $gte: sevenDaysAgo }
        });

        // 5. Success Metric (Users with > 50% progress)
        const successfulLearners = await Progress.countDocuments({
            progressPercentage: { $gt: 50 }
        });

        const stats = {
            overview: {
                totalUsers,
                activeUsers: activeUsersCount,
                blockedUsers: blockedUsersCount,
                totalRoadmaps,
                totalSavedJobs,
                recentInteractions,
                successfulLearners
            },
            userGrowth: userGrowth.map(item => ({
                date: item._id,
                count: item.count
            })),
            skillTrends: skillTrends.map(item => ({
                skill: item._id,
                count: item.count
            }))
        };

        res.status(200).json(ResponseGenerator.sendSuccess(stats, "Admin statistics retrieved successfully"));
    } catch (error) {
        console.error("Error generating admin stats:", error);
        res.status(500).json(ResponseGenerator.sendError(
            ResponseGenerator.INTERNAL_SERVER_ERROR, 
            "Failed to generate system stats", 
            error.message
        ));
    }
};
