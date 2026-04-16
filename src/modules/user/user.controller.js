import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../middleware/authenticaion.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { updateProfileValidation } from "./user.validation.js";
import { cloudinaryUpload } from "../../utils/multer/cloud.multer.js";

const router = Router();

// Apply authentication to all routes
router.use(authentication());

// Get profile
router.get("/profile", userService.getProfile);

// Update profile
router.patch(
    "/",
    cloudinaryUpload().single("image"),
    validation(updateProfileValidation),
    userService.updateProfile
);

export default router;
