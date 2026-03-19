// Re-export shared types from @repo/validation
export type { AuthUserPayload, UserSession, UserRole } from "@repo/validation";
export { USER_ROLES } from "@repo/validation";

export interface SessionPayload {
    refreshToken: string;
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
}
