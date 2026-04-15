import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
        windowMs: process.env.RATE_LIMIT_WINDOW,
        limit: process.env.RATE_LIMIT_MAX,
        message: {
            status: 429,
            message: "Too many requests from this IP, please try again"
        },
});