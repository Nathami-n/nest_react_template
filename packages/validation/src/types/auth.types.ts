import type { UserRole } from '../constants';

// Auth Strategies
export const AUTH_STRATEGIES = {
    LOCAL: 'local',
    GOOGLE: 'google',
} as const;

export type AuthStrategy = typeof AUTH_STRATEGIES[keyof typeof AUTH_STRATEGIES];

// User Session Type (returned from /auth/me)
export interface UserSession {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    sessionId: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
}

// Authenticated User Payload (for JWT)
export interface AuthUserPayload {
    userId: string;
    email: string;
    role: UserRole;
    sessionId: string;
}

// Authenticated User (what JWT strategy returns and is attached to req.user)
export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    sessionId: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
}