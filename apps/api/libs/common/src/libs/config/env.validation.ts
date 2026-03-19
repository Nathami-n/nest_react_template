import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'staging', 'sandbox').default('development'),
    PORT: Joi.number().default(5002),
    APP_NAME: Joi.string().default('CITAPAY API'),
    LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),

    DATABASE_URL: Joi.string().required(),

    API_URL: Joi.string().uri().optional(),

    // JWT Configuration
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.number().default(3600), // 1 hour in seconds
    JWT_REFRESH_EXPIRATION: Joi.number().default(604800), // 7 days in seconds

    // Google OAuth (optional - only required if using Google auth)
    GOOGLE_CLIENT_ID: Joi.string().optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().optional(),
    GOOGLE_CALLBACK_URL: Joi.string().uri().optional(),

    // Frontend URL for OAuth redirects
    FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),

    // CORS Configuration
    CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:5173'),

    // Email Configuration
    MAIL_FROM: Joi.string().email().default('noreply@pay.citatech.cloud'),
    MAIL_FROM_NAME: Joi.string().default('CitaPay'),
    // Development (Mailhog)
    MAILHOG_HOST: Joi.string().default('localhost'),
    MAILHOG_PORT: Joi.number().default(1026), // Custom port to avoid conflicts
    // Production (Resend)
    RESEND_API_KEY: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Redis (optional)
    REDIS_URL: Joi.string().uri().optional(),
    REDIS_PASSWORD: Joi.string().allow('').when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Bull Board Dashboard Authentication (required in production)
    BULL_BOARD_USERNAME: Joi.string().allow('').when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    BULL_BOARD_PASSWORD: Joi.string().allow('').min(12).when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Rate Limiting (optional - has defaults in throttler module)
    THROTTLE_SHORT_TTL: Joi.number().default(1000),
    THROTTLE_SHORT_LIMIT: Joi.number().default(3),
    THROTTLE_MEDIUM_TTL: Joi.number().default(10000),
    THROTTLE_MEDIUM_LIMIT: Joi.number().default(20),
    THROTTLE_LONG_TTL: Joi.number().default(60000),
    THROTTLE_LONG_LIMIT: Joi.number().default(100),
});
