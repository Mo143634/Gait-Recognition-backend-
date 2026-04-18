import { UserModel, roles } from "../../db/models/user.model.js";
import { GaitProfileModel } from "../gait/gait.model.js";
import { GaitAnalysisModel } from "../analysis/analysis.model.js";
import TokenModel from "../../db/models/token.model.js";

/**
 * Get total subjects count
 */
export const getSubjectsStats = async () => {
    const totalSubjects = await UserModel.countDocuments({ role: roles.user });
    return totalSubjects;
};

/**
 * Get processed videos count
 */
export const getVideosStats = async () => {
    const processedVideos = await GaitAnalysisModel.countDocuments({ status: "completed" });
    return processedVideos;
};

/**
 * Get recognition accuracy (average confidence score)
 */
export const getAccuracyStats = async () => {
    const result = await GaitAnalysisModel.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: null,
                avgAccuracy: { $avg: "$confidence_score" }
            }
        }
    ]);
    
    return result.length > 0 ? parseFloat(result[0].avgAccuracy.toFixed(1)) : 0;
};

/**
 * Get active sessions count
 */
export const getSessionsStats = async () => {
    // Count tokens that haven't expired
    // jti.expireIn is a timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    const activeSessions = await TokenModel.countDocuments({ expireIn: { $gt: now } });
    return activeSessions;
};

/**
 * Get data for accuracy chart (time-series)
 */
export const getAccuracyChartData = async () => {
    // Group analysis by hour
    // For demo purposes, we'll return the last 24 hours of data or mock if data is sparse
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const analysisData = await GaitAnalysisModel.aggregate([
        { 
            $match: { 
                status: "completed",
                completed_at: { $gte: last24Hours }
            } 
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%H:00", date: "$completed_at" }
                },
                avgAccuracy: { $avg: "$confidence_score" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Map to the requested format
    const formattedData = analysisData.map(item => ({
        time: item._id,
        accuracy: Math.round(item.avgAccuracy)
    }));

    // If no data, provide fallback mocks as requested in the requirements
    if (formattedData.length === 0) {
        return [
            { time: "00:00", accuracy: 93 },
            { time: "04:00", accuracy: 94 },
            { time: "08:00", accuracy: 96 },
            { time: "12:00", accuracy: 95 },
            { time: "16:00", accuracy: 96 },
            { time: "20:00", accuracy: 95 }
        ];
    }

    return formattedData;
};

/**
 * Get system status
 */
export const getSystemStatus = async () => {
    // Mock health check for now - in production this would ping services
    return {
        modelInference: "online",
        geiGenerator: "online",
        featureExtractor: "online",
        database: "online",
        lastSync: "2 minutes ago"
    };
};

/**
 * Get recent uploads
 */
export const getRecentUploads = async (limit = 10) => {
    const recentProfiles = await GaitProfileModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    const formattedUploads = await Promise.all(recentProfiles.map(async (profile) => {
        const analysis = await GaitAnalysisModel.findOne({ gait_profile_id: profile._id })
            .sort({ createdAt: -1 });

        // Map internal status to requested status: identified, processing, failed
        let status = "processing";
        if (analysis) {
            if (analysis.status === "completed") status = "identified";
            else if (analysis.status === "failed") status = "failed";
            else status = "processing";
        } else if (profile.status === "failed") {
            status = "failed";
        }

        return {
            id: profile._id.toString().substring(0, 8),
            filename: profile.file_name,
            subject: `Subject #${profile.user_id.toString().substring(0, 4)}`,
            status: status,
            score: analysis?.confidence_score ? (analysis.confidence_score / 100).toFixed(2) : 0,
            time: formatTimeAgo(profile.createdAt)
        };
    }));

    return formattedUploads;
};

/**
 * Helper to format time ago
 */
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return Math.floor(seconds) + " sec ago";
}
