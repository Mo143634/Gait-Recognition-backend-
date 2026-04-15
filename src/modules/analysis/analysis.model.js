import mongoose, { Schema } from "mongoose";

export const gaitAnalysisSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gait_profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GaitProfile",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    },
    result: {
        gait_pattern: String,
        biomechanical_metrics: {
            stride_length: Number,
            stride_width: Number,
            step_time: Number,
            gait_speed: Number,
            cadence: Number
        },
        movement_analysis: {
            joint_angles: {
                hip: Number,
                knee: Number,
                ankle: Number
            },
            movement_quality: String
        },
        posture_analysis: {
            spine_alignment: String,
            shoulder_alignment: String,
            head_position: String
        },
        symmetry_score: Number // 0-100
    },
    confidence_score: {
        type: Number,
        min: 0,
        max: 100,
        description: "Confidence percentage of the analysis"
    },
    ai_response: {
        type: mongoose.Schema.Types.Mixed,
        description: "Raw response from AI API"
    },
    error_message: String,
    requested_at: {
        type: Date,
        default: Date.now
    },
    completed_at: Date,
    processing_time_ms: Number
}, { timestamps: true });

export const GaitAnalysisModel = mongoose.models.GaitAnalysis || mongoose.model("GaitAnalysis", gaitAnalysisSchema);
