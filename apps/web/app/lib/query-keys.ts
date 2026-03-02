/**
 * Centralized query keys factory for type-safe query invalidation
 * All features should use keys from this factory
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: (id: string) => [...queryKeys.auth.all, "user", id] as const,
  }
} as const;