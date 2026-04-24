import { Router } from "express";
import * as searchController from "./search.controller.js";
import { authentication } from "../../middleware/authenticaion.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { searchGaitValidation } from "./search.validation.js";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const router = Router();

// Configure local storage for search video files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve('uploads/search');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'search-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Apply authentication
router.use(authentication());

/**
 * @route POST /api/analysis/search
 * @desc Search for similar gait profiles (Recognition)
 */
router.post(
    "/",
    upload.single('file'),
    validation(searchGaitValidation),
    searchController.searchGait
);

export default router;
