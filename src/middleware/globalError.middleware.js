/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
    const status = err.status || err.cause || 500;
    const message = err.message || "Internal Server Error";
    
    // In development mode, we include the stack trace for debugging
    const response = {
        success: false,
        data: null,
        error: message
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    return res.status(status).json(response);
};
