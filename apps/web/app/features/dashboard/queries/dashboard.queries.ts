import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

export const dashboardQueries = {
  stats: () =>
    queryOptions({
      queryKey: queryKeys.dashboard.stats(),
      queryFn: () => dashboardApi.getStats(),
    }),

  revenueHistory: (startDate: Date, endDate: Date) =>
    queryOptions({
      queryKey: queryKeys.dashboard.revenueHistory(
        startDate.toISOString(),
        endDate.toISOString()
      ),
      queryFn: () => dashboardApi.getRevenueHistory(startDate, endDate),
    }),

  userGrowth: (startDate: Date, endDate: Date) =>
    queryOptions({
      queryKey: queryKeys.dashboard.userGrowth(
        startDate.toISOString(),
        endDate.toISOString()
      ),
      queryFn: () => dashboardApi.getUserGrowth(startDate, endDate),
    }),

  activityDistribution: () =>
    queryOptions({
      queryKey: queryKeys.dashboard.activityDistribution(),
      queryFn: () => dashboardApi.getActivityDistribution(),
    }),

  statusDistribution: () =>
    queryOptions({
      queryKey: queryKeys.dashboard.statusDistribution(),
      queryFn: () => dashboardApi.getStatusDistribution(),
    }),
};
