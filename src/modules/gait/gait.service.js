import { GaitProfileModel } from "./gait.model.js";
import { UserModel } from "../../db/models/user.model.js";
import { cloudinaryConfig } from "../../utils/multer/cloudinary.js";

const cloudinary = cloudinaryConfig();

export const uploadGaitVideo = async (req, res, next) => {
    try {
        const { description } = req.body;
        const userId = req.user._id;

        if (!req.file) {
            return next(new Error("No video file provided", { cause: 400 }));
        }

        // Validate file type
        const allowedMimeTypes = ["video/mp4", "video/mpeg", "video/avi", "video/quicktime"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return next(new Error("Invalid video format. Only MP4, MPEG, AVI, and MOV are allowed", { cause: 400 }));
        }

        // Upload to Cloudinary
        let uploadResult;
        try {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: `gait-recognition/videos/${userId}`,
                public_id: `${Date.now()}_${req.user._id}`,
                quality: "auto:eco"
            });
        } catch (uploadError) {
            return next(new Error("Failed to upload video to cloud storage", { cause: 500 }));
        }

        // Create gait profile record
        const gaitProfile = new GaitProfileModel({
            user_id: userId,
            video_url: uploadResult.secure_url,
            video_public_id: uploadResult.public_id,
            file_name: req.file.originalname,
            file_size: req.file.size,
            description: description || "",
            status: "pending",
            metadata: {
                duration: uploadResult.duration
            }
        });

        await gaitProfile.save();

        // Add to user's gait profiles
        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { gaitProfiles: gaitProfile._id } },
            { new: true }
        );

        return {
            statusCode: 201,
            message: "Gait video uploaded successfully",
            data: gaitProfile
        };
    } catch (error) {
        return next(error);
    }
};

export const getGaitProfile = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const userId = req.user._id;

        const gaitProfile = await GaitProfileModel.findOne({
            _id: profileId,
            user_id: userId
        });

        if (!gaitProfile) {
            return next(new Error("Gait profile not found", { cause: 404 }));
        }

        return {
            statusCode: 200,
            message: "Gait profile retrieved successfully",
            data: gaitProfile
        };
    } catch (error) {
        return next(error);
    }
};

export const listGaitProfiles = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const gaitProfiles = await GaitProfileModel.find({ user_id: userId })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await GaitProfileModel.countDocuments({ user_id: userId });

        return {
            statusCode: 200,
            message: "Gait profiles retrieved successfully",
            data: {
                profiles: gaitProfiles,
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

export const updateGaitProfile = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const userId = req.user._id;
        const { description } = req.body;

        const gaitProfile = await GaitProfileModel.findOneAndUpdate(
            { _id: profileId, user_id: userId },
            { description },
            { new: true, runValidators: true }
        );

        if (!gaitProfile) {
            return next(new Error("Gait profile not found", { cause: 404 }));
        }

        return {
            statusCode: 200,
            message: "Gait profile updated successfully",
            data: gaitProfile
        };
    } catch (error) {
        return next(error);
    }
};

export const deleteGaitProfile = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const userId = req.user._id;

        const gaitProfile = await GaitProfileModel.findOne({
            _id: profileId,
            user_id: userId
        });

        if (!gaitProfile) {
            return next(new Error("Gait profile not found", { cause: 404 }));
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(gaitProfile.video_public_id, { resource_type: "video" });
        } catch (deleteError) {
            console.error("Failed to delete video from cloud storage:", deleteError);
        }

        // Delete gait profile
        await GaitProfileModel.deleteOne({ _id: profileId });

        // Remove from user's gait profiles
        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { gaitProfiles: profileId } },
            { new: true }
        );

        return {
            statusCode: 200,
            message: "Gait profile deleted successfully",
            data: {}
        };
    } catch (error) {
        return next(error);
    }
};
