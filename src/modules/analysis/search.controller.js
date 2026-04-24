import * as searchService from './search.service.js';
import * as predictionService from '../prediction/prediction.service.js';
import { GaitAnalysisModel } from './analysis.model.js';
import { successResponse } from '../../utils/response/response.utils.js';

/**
 * Search/Recognize gait
 */
export const searchGait = async (req, res, next) => {
    try {
        let featureVector;
        const topK = parseInt(req.query.limit || '5');

        // Mode 1: Upload Video
        if (req.file) {
            console.log("Processing search via video upload...");
            const prediction = await predictionService.predictModel(req.file);
            featureVector = prediction.feature_vector;
        } 
        // Mode 2: Using analysisId
        else if (req.body.analysisId) {
            console.log(`Processing search via analysisId: ${req.body.analysisId}`);
            const analysis = await GaitAnalysisModel.findById(req.body.analysisId);
            if (!analysis || !analysis.embedding || analysis.embedding.length === 0) {
                return next(new Error("Analysis not found or contains no embedding", { cause: 404 }));
            }
            featureVector = analysis.embedding;
        } else {
            return next(new Error("Either a video file or an analysisId must be provided", { cause: 400 }));
        }

        // Validate vector
        if (!featureVector || featureVector.length === 0) {
            return next(new Error("Could not extract feature vector for search", { cause: 500 }));
        }

        // Perform similarity search
        const matches = await searchService.findSimilarGait(featureVector, topK);

        return successResponse({
            res,
            statusCode: 200,
            message: "Gait similarity search completed",
            data: {
                matches,
                vector_length: featureVector.length
            }
        });

    } catch (error) {
        return next(error);
    }
};
