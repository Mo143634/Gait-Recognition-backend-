import joi from 'joi';

/**
 * Validation schema for prediction request
 */
export const predictValidation = {
    body: joi.object({
        // We allow unknown fields so metadata (like 'video' text field) doesn't break validation
    }).unknown(true).required()
};


