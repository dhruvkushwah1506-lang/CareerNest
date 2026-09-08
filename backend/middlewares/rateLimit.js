import rateLimit from 'express-rate-limit';


export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, // Limit each IP to 10 requests 
    message: {
        success: false,
        msg: "Too many accounts created or login attempts from this IP, please try again after an hour"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for data creation routes (post job, register company)
export const dataCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per `window`
    message: {
        success: false,
        msg: "You have reached the maximum limit of companies or jobs you can create per hour. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for AI generation routes (each call costs real money via the OpenAI API)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15, // Limit each IP to 15 AI generations per hour
    message: {
        success: false,
        msg: "You have reached the AI generation limit for this hour. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
