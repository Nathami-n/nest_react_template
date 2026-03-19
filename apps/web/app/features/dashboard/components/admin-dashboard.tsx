import { useState } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import {
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  AreaChart,
  BarChart,
  DonutChart,
  DateRangePicker,
  type DateRange,
} from "@repo/ui/components";
import {
  DashboardSquare01Icon,
  UserMultiple02Icon,
  ChartLineData03Icon,
  Activity02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { href, Link } from "react-router";
import {
  useDashboardStats,
  useRevenueHistory,
  useUserGrowth,
  useActivityDistribution,
  useStatusDistribution,
} from "@/features/dashboard/queries";

const CHART_COLORS = ["#F43F5E", "#FB923C", "#FBBF24", "#FF4D6D", "#C9184A"];

export function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueHistory, isLoading: revenueLoading } = useRevenueHistory(
    dateRange.from || subDays(new Date(), 6),
    dateRange.to || new Date(),
  );
  const { data: userGrowth, isLoading: userGrowthLoading } = useUserGrowth(
    dateRange.from || subDays(new Date(), 6),
    dateRange.to || new Date(),
  );
  const { data: activityDist, isLoading: activityLoading } =
    useActivityDistribution();
  const { data: statusDist, isLoading: statusLoading } =
    useStatusDistribution();

  // Format chart data
  const days =
    dateRange.from && dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : [];

  const revenueMap = new Map(
    revenueHistory?.data?.map((item) => [item.date, item.revenue]),
  );

  const userGrowthMap = new Map(
    userGrowth?.data?.map((item) => [item.date, item.revenue]),
  );

  const revenueSeries = [
    {
      name: "Revenue",
      data: days.map((day) => revenueMap.get(format(day, "yyyy-MM-dd")) || 0),
    },
  ];

  const userGrowthSeries = [
    {
      name: "Users",
      data: days.map(
        (day) => userGrowthMap.get(format(day, "yyyy-MM-dd")) || 0,
      ),
    },
  ];

  const revenueCategories = days.map((day) => format(day, "MMM dd"));

  const activitySeries = [
    {
      name: "Activity",
      data: activityDist?.data?.map((item) => item.value) || [],
    },
  ];

  const activityCategories = activityDist?.data?.map((item) => item.name) || [];

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.data?.totalUsers.toLocaleString() || "0",
      change: `+${stats?.data?.userChange || 0}% from last month`,
      changeType: "positive" as const,
      icon: UserMultiple02Icon,
    },
    {
      title: "Active Users",
      value: stats?.data?.activeUsers.toLocaleString() || "0",
      change: `+${stats?.data?.activeUserChange || 0}% from last month`,
      changeType: "positive" as const,
      icon: Activity02Icon,
    },
    {
      title: "Total Revenue",
      value: `$${stats?.data?.totalRevenue.toLocaleString() || "0"}`,
      change: `+${stats?.data?.revenueChange || 0}% from last month`,
      changeType: "positive" as const,
      icon: DashboardSquare01Icon,
    },
    {
      title: "Growth Rate",
      value: `${stats?.data?.growthRate || 0}%`,
      change: `+${stats?.data?.growthRateChange || 0}% from last month`,
      changeType: "positive" as const,
      icon: ChartLineData03Icon,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Admin Dashboard"
          description="Platform-wide metrics and analytics"
        />
        <DateRangePicker
          value={dateRange}
          onChange={(range) => {
            if (range) {
              setDateRange(range);
            }
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                {statsLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <HugeiconsIcon
                  icon={stat.icon}
                  className="h-6 w-6 text-primary"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Chart - Spans 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-75 animate-pulse rounded bg-muted" />
            ) : (
              <AreaChart
                data={revenueSeries}
                categories={revenueCategories}
                colors={CHART_COLORS}
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="h-75 animate-pulse rounded bg-muted" />
            ) : (
              <BarChart
                data={activitySeries}
                categories={activityCategories}
                colors={CHART_COLORS}
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {userGrowthLoading ? (
              <div className="h-75 animate-pulse rounded bg-muted" />
            ) : (
              <AreaChart
                data={userGrowthSeries}
                categories={revenueCategories}
                colors={["#3B82F6"]}
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="h-75 animate-pulse rounded bg-muted" />
            ) : (
              <DonutChart
                data={statusDist?.data?.map((item) => item.value) || []}
                labels={statusDist?.data?.map((item) => item.name) || []}
                colors={CHART_COLORS}
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <HugeiconsIcon icon={Activity02Icon} className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <HugeiconsIcon
                    icon={DashboardSquare01Icon}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">
                    Connected and healthy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <HugeiconsIcon
                    icon={ChartLineData03Icon}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Cache</p>
                  <p className="text-xs text-muted-foreground">
                    Performance optimal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              to={href("/dashboard/settings")}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <HugeiconsIcon icon={UserMultiple02Icon} className="size-5" />
              <div>
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">
                  View and manage all users
                </div>
              </div>
            </Link>
            <Link
              to={href("/dashboard/settings")}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} className="size-5" />
              <div>
                <div className="font-medium">Platform Settings</div>
                <div className="text-sm text-muted-foreground">
                  Configure platform
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-3 p-4 border rounded-lg opacity-50">
              <HugeiconsIcon icon={ChartLineData03Icon} className="size-5" />
              <div>
                <div className="font-medium">Advanced Analytics</div>
                <div className="text-sm text-muted-foreground">Coming soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
