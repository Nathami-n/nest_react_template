import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";

export const useDashboardStats = () => {
  return useQuery(dashboardQueries.stats());
};

export const useRevenueHistory = (startDate: Date, endDate: Date) => {
  return useQuery(dashboardQueries.revenueHistory(startDate, endDate));
};

export const useUserGrowth = (startDate: Date, endDate: Date) => {
  return useQuery(dashboardQueries.userGrowth(startDate, endDate));
};

export const useActivityDistribution = () => {
  return useQuery(dashboardQueries.activityDistribution());
};

export const useStatusDistribution = () => {
  return useQuery(dashboardQueries.statusDistribution());
};
