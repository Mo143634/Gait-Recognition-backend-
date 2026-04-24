import * as predictionService from './prediction.service.js';
import { successResponse } from '../../utils/response/response.utils.js';

/**
 * Predict controller
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const predict = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new Error("No file provided for prediction", { cause: 400 }));
        }
        
        // Pass the file object to the service
        const result = await predictionService.predictModel(req.file);

        // Standardized response
        return successResponse({
            res,
            statusCode: 200,
            message: "Prediction retrieved successfully from AI model",
            data: result
        });
    } catch (error) {
        return next(error);
    }
};

