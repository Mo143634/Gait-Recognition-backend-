/**
 * Standardized success response utility
 * @param {Object} params
 * @param {Response} params.res - Express response object
 * @param {number} params.statusCode - HTTP status code
 * @param {string} params.message - Success message
 * @param {any} params.data - Response data
 */
export const successResponse = ({ res, statusCode = 200, message = "Done", data = {} } = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        error: null
    });
};
