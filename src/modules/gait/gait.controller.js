import { Router } from "express";
import * as gaitService from "./gait.service.js";
import { authentication } from "../../middleware/authenticaion.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
    uploadGaitValidation,
    getGaitProfileValidation,
    updateGaitProfileValidation,
    deleteGaitProfileValidation,
    listGaitProfilesValidation
} from "./gait.validation.js";
import { cloudinaryUpload } from "../../utils/multer/cloud.multer.js";

const router = Router();

// Apply authentication to all routes
router.use(authentication());

// Upload gait video
router.post(
    '/upload',
    cloudinaryUpload().single('video'),
    validation(uploadGaitValidation),
    async (req, res, next) => {
        const result = await gaitService.uploadGaitVideo(req, res, next);
        if (result && !res.headersSent) {
            res.status(result.statusCode).json({
                message: result.message,
                data: result.data
            });
        }
    }
);

// Get single gait profile
router.get(
    '/:profileId',
    validation(getGaitProfileValidation),
    async (req, res, next) => {
        const result = await gaitService.getGaitProfile(req, res, next);
        if (result && !res.headersSent) {
            res.status(result.statusCode).json({
                message: result.message,
                data: result.data
            });
        }
    }
);

// List all gait profiles
router.get(
    '/',
    validation(listGaitProfilesValidation),
    async (req, res, next) => {
        const result = await gaitService.listGaitProfiles(req, res, next);
        if (result && !res.headersSent) {
            res.status(result.statusCode).json({
                message: result.message,
                data: result.data
            });
        }
    }
);

// Update gait profile
router.patch(
    '/:profileId',
    validation(updateGaitProfileValidation),
    async (req, res, next) => {
        const result = await gaitService.updateGaitProfile(req, res, next);
        if (result && !res.headersSent) {
            res.status(result.statusCode).json({
                message: result.message,
                data: result.data
            });
        }
    }
);

// Delete gait profile
router.delete(
    '/:profileId',
    validation(deleteGaitProfileValidation),
    async (req, res, next) => {
        const result = await gaitService.deleteGaitProfile(req, res, next);
        if (result && !res.headersSent) {
            res.status(result.statusCode).json({
                message: result.message,
                data: result.data
            });
        }
    }
);

export default router;
