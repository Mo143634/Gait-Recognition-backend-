/**
 * Custom Error Class for API errors
 */
export class ErrorClass extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.cause = status;
    }
}

/**
 * Async Handler Wrapper to catch errors in async routes
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch((error) => {
            return next(new ErrorClass(error.message, error.status || 500));
        });
    };
};
