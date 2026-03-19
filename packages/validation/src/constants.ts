/**
 * User role constants
 * These should match the UserRole enum in Prisma schema
 */
export const USER_ROLES = {
    PLATFORM_ADMIN: 'PLATFORM_ADMIN', // Internal platform administrators
    ADMIN: 'ADMIN',                    // Organization/company admins
    USER: 'USER',                      // Regular users
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
