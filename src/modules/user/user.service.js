import { UserModel } from "../../db/models/user.model.js";
import { cloudinaryConfig } from "../../utils/multer/cloudinary.js";
import { successResponse } from "../../utils/multer/successResponse.utils.js";
import { encrypt, decrypt } from "../../utils/Encryption/encription.utils.js";
import { deleteFile } from "../../utils/file/fileActions.js";

const cloudinary = cloudinaryConfig();

export const getProfile = async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select("-password -confirm_email_otp -forget_password_otp");
    
    // Decrypt phone if it exists
    if (user.phone) {
        user.phone = decrypt(user.phone);
    }
    
    return successResponse({
        res,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: user
    });
};

export const updateProfile = async (req, res, next) => {
    const { fullname, gender, phone } = req.body;
    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = encrypt(phone);

    // Handle profile image upload
    if (req.file) {
        try {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: `gait-recognition/users/${req.user._id}/profile`,
                public_id: `profile_${Date.now()}`
            });
            updateData.profile_cloud_Image = {
                public_id: uploadResult.public_id,
                secure_url: uploadResult.secure_url
            };
            updateData.profile_Image = uploadResult.secure_url;
            
            // Remove temporary file from local storage
            deleteFile(req.file.path);
        } catch (error) {
            return next(new Error("Failed to upload profile image", { cause: 500 }));
        }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    ).select("-password -confirm_email_otp -forget_password_otp");

    // Decrypt phone if it exists
    if (updatedUser.phone) {
        updatedUser.phone = decrypt(updatedUser.phone);
    }

    return successResponse({
        res,
        statusCode: 200,
        message: "Profile updated successfully",
        data: updatedUser
    });
};
