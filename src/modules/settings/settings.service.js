import { UserModel } from "../../db/models/user.model.js";
import { SettingModel } from "../../db/models/setting.model.js";

/**
 * Get current user profile settings
 */
export const getProfile = async (userId) => {
    const user = await UserModel.findById(userId).select("fullname email role institution");
    if (!user) throw new Error("User not found", { cause: 404 });
    
    return {
        fullName: user.fullname,
        email: user.email,
        role: user.role,
        institution: user.institution || ""
    };
};

/**
 * Update user profile settings
 */
export const updateProfile = async (userId, updateData) => {
    const { fullName, institution } = updateData;
    
    const user = await UserModel.findByIdAndUpdate(
        userId,
        { 
            fullname: fullName, 
            institution: institution 
        },
        { new: true, runValidators: true }
    ).select("fullname email role institution");

    return {
        fullName: user.fullname,
        email: user.email,
        role: user.role,
        institution: user.institution || ""
    };
};

/**
 * Get model configuration settings
 */
export const getModelConfig = async () => {
    let settings = await SettingModel.findOne({ name: "default_model_config" });
    
    if (!settings) {
        // Initialize default settings if they don't exist
        settings = await SettingModel.create({
            similarityThreshold: 0.75,
            frameSamplingRate: 30,
            name: "default_model_config"
        });
    }
    
    return {
        similarityThreshold: settings.similarityThreshold,
        frameSamplingRate: settings.frameSamplingRate
    };
};

/**
 * Update model configuration settings (Admin only)
 */
export const updateModelConfig = async (configData) => {
    const { similarityThreshold, frameSamplingRate } = configData;
    
    const settings = await SettingModel.findOneAndUpdate(
        { name: "default_model_config" },
        { similarityThreshold, frameSamplingRate },
        { new: true, upsert: true, runValidators: true }
    );

    return {
        similarityThreshold: settings.similarityThreshold,
        frameSamplingRate: settings.frameSamplingRate
    };
};
