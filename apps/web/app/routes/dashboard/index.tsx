import { getDashboardComponent } from "@/features/dashboard";

/**
 * Main Dashboard Route Component
 *
 * This component uses a registry pattern to render role-specific dashboards.
 * The registry pattern provides:
 * - Type safety: All roles must have a registered dashboard component
 * - Maintainability: Easy to add new role-based dashboards
 * - Separation of concerns: Each dashboard is self-contained
 * - Testability: Dashboard components can be tested independently
 *
 * To add a new role-based dashboard:
 * 1. Create a new dashboard component in features/dashboard/components
 * 2. Register it in the DASHBOARD_REGISTRY
 * 3. No changes needed in this file
 */
export default function DashboardIndex({ loaderData }: any) {
  const { user } = loaderData;

  // Get the appropriate dashboard component for the user's role
  const DashboardComponent = getDashboardComponent(user.role);

  // Render the role-specific dashboard
  return <DashboardComponent user={user} />;
}
