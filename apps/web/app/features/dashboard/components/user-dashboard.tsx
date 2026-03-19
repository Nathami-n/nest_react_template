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
import type { User } from "@repo/validation";

const CHART_COLORS = ["#F43F5E", "#FB923C", "#FBBF24", "#FF4D6D", "#C9184A"];

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name || user.email}!`}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Profile Status
              </p>
              <p className="text-2xl font-bold">
                {user.emailVerified ? "Verified" : "Pending"}
              </p>
              <p className="text-xs text-green-600">
                {user.emailVerified ? "Email verified" : "Verify email"}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <HugeiconsIcon
                icon={UserMultiple02Icon}
                className="h-6 w-6 text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Account Type
              </p>
              <p className="text-2xl font-bold capitalize">
                {user.role.toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">Standard access</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                className="h-6 w-6 text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Member Since
              </p>
              <p className="text-2xl font-bold">
                {format(new Date(user.createdAt), "MMM yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <HugeiconsIcon
                icon={ChartLineData03Icon}
                className="h-6 w-6 text-primary"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Activity
              </p>
              <p className="text-2xl font-bold">
                {user.isActive ? "Active" : "Inactive"}
              </p>
              <p className="text-xs text-green-600">Last login: Today</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <HugeiconsIcon
                icon={Activity02Icon}
                className="h-6 w-6 text-primary"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Profile updated",
                  description: "You updated your profile information",
                  time: "2 hours ago",
                },
                {
                  id: 2,
                  title: "Password changed",
                  description: "Your password was successfully changed",
                  time: "1 day ago",
                },
                {
                  id: 3,
                  title: "Login",
                  description: "Successful login from new device",
                  time: "2 days ago",
                },
                {
                  id: 4,
                  title: "Account created",
                  description: "Welcome to the platform!",
                  time: format(new Date(user.createdAt), "MMM dd, yyyy"),
                },
              ].map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Activity02Icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              to={href("/dashboard/settings/profile")}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <HugeiconsIcon icon={UserMultiple02Icon} className="size-5" />
              <div>
                <div className="font-medium">Edit Profile</div>
                <div className="text-sm text-muted-foreground">
                  Update your information
                </div>
              </div>
            </Link>
            <Link
              to={href("/dashboard/settings")}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} className="size-5" />
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-sm text-muted-foreground">
                  Configure your account
                </div>
              </div>
            </Link>
            {!user.emailVerified && (
              <Link
                to={href("/auth/verify-email")}
                className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg hover:bg-accent transition-colors"
              >
                <HugeiconsIcon icon={ChartLineData03Icon} className="size-5" />
                <div>
                  <div className="font-medium">Verify Email</div>
                  <div className="text-sm text-muted-foreground">
                    Complete your verification
                  </div>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${user.emailVerified ? "bg-green-500/10 text-green-600" : "bg-muted"}`}
              >
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Verify your email</p>
                <p className="text-sm text-muted-foreground">
                  {user.emailVerified
                    ? "✓ Email verified successfully"
                    : "Check your inbox and verify your email address"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${user.name ? "bg-green-500/10 text-green-600" : "bg-muted"}`}
              >
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  {user.name
                    ? "✓ Profile completed"
                    : "Add your name and other details"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Explore features</p>
                <p className="text-sm text-muted-foreground">
                  Discover what you can do with your account
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
