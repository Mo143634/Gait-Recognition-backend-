import { Router } from "express";
import * as predictionController from "./prediction.controller.js";
import { validation } from "../../middleware/validation.middleware.js";
import { predictValidation } from "./prediction.validation.js";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const router = Router();

// Configure local storage for prediction files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve('uploads/predictions');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

/**
 * @route POST /api/predict
 * @desc Get prediction from Hugging Face Space model
 */
router.post(
    "/",
    upload.single('file'),
    validation(predictValidation),
    predictionController.predict
);

export default router;

