import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../middleware/authenticaion.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { updateProfileValidation, updateRoleValidation } from "./user.validation.js";
import { cloudinaryUpload } from "../../utils/multer/cloud.multer.js";
import { roles } from "../../db/models/user.model.js";
import { authorization } from "../../middleware/authenticaion.middleware.js";

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

// Update Role (Admin Only)
router.patch(
    "/:userId/role",
    authorization({ accessRoles: [roles.admin] }),
    validation(updateRoleValidation),
    userService.updateRole
);
