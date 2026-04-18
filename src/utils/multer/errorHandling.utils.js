export const globalErrorHandler = (err, req, res, next) => {
    const status = err.cause || 500;
    return res.status(status).json({
        success: false,
        data: null,
        error: err.message || "Internal Server Error"
    });
};