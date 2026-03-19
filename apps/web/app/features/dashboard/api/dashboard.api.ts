import type {
  DashboardStats,
  RevenueDataPoint,
  DistributionDataPoint,
} from "@repo/validation";
import { format, subDays } from "date-fns";

// Mock API - replace with real API calls
export const dashboardApi = {
  getStats: async (): Promise<{ data: DashboardStats }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: {
        totalUsers: 1234,
        activeUsers: 892,
        totalRevenue: 45231,
        growthRate: 23.5,
        userChange: 12,
        activeUserChange: 8,
        revenueChange: 15,
        growthRateChange: 5.2,
      },
    };
  },

  getRevenueHistory: async (
    startDate: Date,
    endDate: Date
  ): Promise<{ data: RevenueDataPoint[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const data: RevenueDataPoint[] = [];
    for (let i = 0; i <= days; i++) {
      const date = subDays(endDate, days - i);
      data.push({
        date: format(date, "yyyy-MM-dd"),
        revenue: Math.floor(Math.random() * 5000) + 2000,
      });
    }

    return { data };
  },

  getUserGrowth: async (
    startDate: Date,
    endDate: Date
  ): Promise<{ data: RevenueDataPoint[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const data: RevenueDataPoint[] = [];
    for (let i = 0; i <= days; i++) {
      const date = subDays(endDate, days - i);
      data.push({
        date: format(date, "yyyy-MM-dd"),
        revenue: Math.floor(Math.random() * 50) + 20,
      });
    }

    return { data };
  },

  getActivityDistribution: async (): Promise<{
    data: DistributionDataPoint[];
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: [
        { name: "Sign Ups", value: 342, percentage: 35 },
        { name: "Logins", value: 523, percentage: 53 },
        { name: "Profile Updates", value: 87, percentage: 9 },
        { name: "Settings Changes", value: 31, percentage: 3 },
      ],
    };
  },

  getStatusDistribution: async (): Promise<{
    data: DistributionDataPoint[];
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: [
        { name: "Active", value: 892 },
        { name: "Inactive", value: 234 },
        { name: "Pending", value: 108 },
      ],
    };
  },
};
