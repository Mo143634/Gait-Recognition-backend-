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
    condition: {
        type: String,
        enum: ["normal", "bag", "coat"],
        default: "normal"
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
    },
    embedding: {
        type: [Number],
        description: "Gait feature vector (embedding) for similarity search",
        required: false
    }
}, { timestamps: true });

// Note: Vector index will be created in MongoDB Atlas for optimal performance
// A manual fallback using cosine similarity is implemented in the search service.

// Performance indexes
gaitProfileSchema.index({ condition: 1 });
gaitProfileSchema.index({ user_id: 1 });

export const GaitProfileModel = mongoose.models.GaitProfile || mongoose.model("GaitProfile", gaitProfileSchema);
