import { GaitAnalysisModel } from "./analysis.model.js";
import { GaitProfileModel } from "../gait/gait.model.js";
import { UserModel } from "../../db/models/user.model.js";
import axios from 'axios';

const AI_API_URL = process.env.AI_API_URL || "http://localhost:5000/api/analyze";

export const runAnalysis = async (req, res, next) => {
    try {
        const { gait_profile_id } = req.body;
        const userId = req.user._id;
        const startTime = Date.now();

        // Validate gait profile exists and belongs to user
        const gaitProfile = await GaitProfileModel.findOne({
            _id: gait_profile_id,
            user_id: userId
        });

        if (!gaitProfile) {
            return next(new Error("Gait profile not found", { cause: 404 }));
        }

        // Create analysis record
        const analysis = new GaitAnalysisModel({
            user_id: userId,
            gait_profile_id: gait_profile_id,
            status: "processing"
        });

        await analysis.save();

        try {
            // Call external AI API
            const aiResponse = await axios.post(AI_API_URL, {
                video_url: gaitProfile.video_url,
                analysis_id: analysis._id.toString()
            }, {
                timeout: 120000 // 2 minute timeout
            });

            if (aiResponse.status === 200 || aiResponse.status === 202) {
                analysis.status = "completed";
                analysis.result = aiResponse.data.result || {};
                analysis.confidence_score = aiResponse.data.confidence_score || 0;
                analysis.ai_response = aiResponse.data;
                analysis.completed_at = new Date();
            }
        } catch (aiError) {
            console.error("AI API Error:", aiError.message);
            analysis.status = "failed";
            analysis.error_message = aiError.message || "Failed to process analysis";
        }

        analysis.processing_time_ms = Date.now() - startTime;
        await analysis.save();

        // Add to user's analysis history
        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { analysisHistory: analysis._id } },
            { new: true }
        );

        // Update gait profile's last analyzed time
        gaitProfile.last_analyzed_at = new Date();
        await gaitProfile.save();

        return {
            statusCode: 201,
            message: "Analysis request submitted successfully",
            data: analysis
        };
    } catch (error) {
        return next(error);
    }
};

export const getAnalysisResult = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const userId = req.user._id;

        const analysis = await GaitAnalysisModel.findOne({
            _id: analysisId,
            user_id: userId
        }).populate('gait_profile_id');

        if (!analysis) {
            return next(new Error("Analysis result not found", { cause: 404 }));
        }

        return {
            statusCode: 200,
            message: "Analysis result retrieved successfully",
            data: analysis
        };
    } catch (error) {
        return next(error);
    }
};

export const listAnalysisHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, status } = req.query;

        const skip = (page - 1) * limit;
        const filter = { user_id: userId };

        if (status) {
            filter.status = status;
        }

        const analyses = await GaitAnalysisModel.find(filter)
            .populate('gait_profile_id')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await GaitAnalysisModel.countDocuments(filter);

        return {
            statusCode: 200,
            message: "Analysis history retrieved successfully",
            data: {
                analyses,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(total / limit),
                    total_records: total,
                    limit: parseInt(limit)
                }
            }
        };
    } catch (error) {
        return next(error);
    }
};

export const getProfileAnalysisHistory = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        // Verify profile belongs to user
        const gaitProfile = await GaitProfileModel.findOne({
            _id: profileId,
            user_id: userId
        });

        if (!gaitProfile) {
            return next(new Error("Gait profile not found", { cause: 404 }));
        }

        const analyses = await GaitAnalysisModel.find({
            gait_profile_id: profileId,
            user_id: userId
        })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await GaitAnalysisModel.countDocuments({
            gait_profile_id: profileId,
            user_id: userId
        });

        return {
            statusCode: 200,
            message: "Profile analysis history retrieved successfully",
            data: {
                gait_profile_id: profileId,
                analyses,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(total / limit),
                    total_records: total,
                    limit: parseInt(limit)
                }
            }
        };
    } catch (error) {
        return next(error);
    }
};

export const getAnalysisStatistics = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const stats = await GaitAnalysisModel.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    avg_confidence: { $avg: "$confidence_score" }
                }
            }
        ]);

        const totalProcessingTime = await GaitAnalysisModel.aggregate([
            { $match: { user_id: userId, status: "completed" } },
            {
                $group: {
                    _id: null,
                    total_time: { $sum: "$processing_time_ms" },
                    avg_time: { $avg: "$processing_time_ms" }
                }
            }
        ]);

        return {
            statusCode: 200,
            message: "Analysis statistics retrieved successfully",
            data: {
                status_breakdown: stats,
                processing_stats: totalProcessingTime[0] || { total_time: 0, avg_time: 0 }
            }
        };
    } catch (error) {
        return next(error);
    }
};
