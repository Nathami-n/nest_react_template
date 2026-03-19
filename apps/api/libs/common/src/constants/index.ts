/**
 * Global constants and enums for the application.
 * 
 * NOTE: For database-related enums (UserRole, AuthProviderType, MerchantStatus, etc.),
 * use the ones exported from @prisma/client to ensure type safety with the database.
 */

// ============================================
// AUTH CONSTANTS
// ============================================

export const AUTH_STRATEGIES = {
    LOCAL: "local",
    JWT: "jwt",
    GOOGLE: "google",
} as const;

export type AuthStrategy = typeof AUTH_STRATEGIES[keyof typeof AUTH_STRATEGIES];

// ============================================
// PASSPORT FIELD NAMES
// ============================================

export const PASSPORT_FIELDS = {
    USERNAME: "email", // Field used for local strategy username
} as const;

// ============================================
// OAUTH SCOPES
// ============================================

export const GOOGLE_OAUTH_SCOPES = ["email", "profile"] as const;

// ============================================
// COOKIE NAMES
// ============================================

export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

// ============================================
// API KEY PREFIXES
// ============================================

export const API_KEY_PREFIXES = {
    LIVE: "pk_live_",
    TEST: "pk_test_",
} as const;

// ============================================
// WEBHOOK EVENTS
// ============================================

export const WEBHOOK_EVENTS = {
    EXAMPLE_EVENT: "example.event",
} as const;

export type WebhookEvent = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS];

// ============================================
// AUDIT LOG ACTIONS
// ============================================

export const AUDIT_ACTIONS = {
    // Auth
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    SIGNUP: "SIGNUP",
    PASSWORD_RESET: "PASSWORD_RESET",
    PASSWORD_CHANGED: "PASSWORD_CHANGED",
    EMAIL_VERIFIED: "EMAIL_VERIFIED",
    TWO_FACTOR_ENABLED: "TWO_FACTOR_ENABLED",
    TWO_FACTOR_DISABLED: "TWO_FACTOR_DISABLED",

    // User management (admin)
    USER_ENABLED: "USER_ENABLED",
    USER_DISABLED: "USER_DISABLED",

} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

// ============================================
// RESOURCE TYPES (for audit logs)
// ============================================

export const RESOURCE_TYPES = {
    USER: "user",
    SESSION: "session",
    WEBHOOK: "webhook",
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
