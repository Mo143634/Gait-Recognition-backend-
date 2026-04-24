import joi from 'joi';
import { generalFields } from '../../middleware/validation.middleware.js';

export const searchGaitValidation = {
    body: joi.object({
        analysisId: generalFields.id,
    }),
    query: joi.object({
        limit: joi.number().integer().min(1).max(50).default(5),
    }),
    file: joi.object(generalFields.file)
};
