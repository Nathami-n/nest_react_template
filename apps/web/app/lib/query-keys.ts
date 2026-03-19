/**
 * Centralized query keys factory for type-safe query invalidation
 * All features should use keys from this factory
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    user: (id: string) => [...queryKeys.auth.all, "user", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    revenueHistory: (startDate: string, endDate: string) =>
      [...queryKeys.dashboard.all, "revenueHistory", startDate, endDate] as const,
    userGrowth: (startDate: string, endDate: string) =>
      [...queryKeys.dashboard.all, "userGrowth", startDate, endDate] as const,
    activityDistribution: () =>
      [...queryKeys.dashboard.all, "activityDistribution"] as const,
    statusDistribution: () =>
      [...queryKeys.dashboard.all, "statusDistribution"] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (page: number, limit: number, search?: string) =>
      [...queryKeys.users.lists(), { page, limit, search }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  examples: {
    all: ["examples"] as const,
    lists: () => [...queryKeys.examples.all, "list"] as const,
    list: (page: number, limit: number) =>
      [...queryKeys.examples.lists(), { page, limit }] as const,
    details: () => [...queryKeys.examples.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.examples.details(), id] as const,
  },
} as const;

/**
 * Mutation keys for cache management
 */
export const mutationKeys = {
  auth: {
    login: ["auth", "login"] as const,
    signup: ["auth", "signup"] as const,
    logout: ["auth", "logout"] as const,
  },
} as const;