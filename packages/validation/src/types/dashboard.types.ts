export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  growthRate: number;
  userChange: number;
  activeUserChange: number;
  revenueChange: number;
  growthRateChange: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
  percentage?: number;
}
