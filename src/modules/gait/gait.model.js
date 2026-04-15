import mongoose, { Schema } from "mongoose";

export const gaitProfileSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video_url: {
        type: String,
        required: true
    },
    video_public_id: {
        type: String,
        required: true
    },
    video_duration: {
        type: Number,
        description: "Duration in seconds"
    },
    file_size: {
        type: Number,
        description: "File size in bytes"
    },
    file_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    },
    upload_date: {
        type: Date,
        default: Date.now
    },
    last_analyzed_at: {
        type: Date
    },
    metadata: {
        height: Number,
        width: Number,
        frame_rate: Number,
        codec: String
    }
}, { timestamps: true });

export const GaitProfileModel = mongoose.models.GaitProfile || mongoose.model("GaitProfile", gaitProfileSchema);
