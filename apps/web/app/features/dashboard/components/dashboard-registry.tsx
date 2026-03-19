import type { ComponentType } from "react";
import type { User } from "@repo/validation";
import { USER_ROLES, type UserRole } from "@repo/validation";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";
import { PlatformAdminDashboard } from "@/features/dashboard/components/platform-admin-dashboard";

/**
 * Dashboard component props interface
 */
export interface DashboardComponentProps {
  user: User;
}

/**
 * Type for dashboard components
 */
type DashboardComponent = ComponentType<DashboardComponentProps>;

/**
 * Registry mapping user roles to their respective dashboard components
 * This pattern provides:
 * - Type safety: Ensures all roles have a registered dashboard
 * - Maintainability: Easy to add new role-based dashboards
 * - Scalability: Centralized management of dashboard variants
 * - Testability: Each dashboard component can be tested independently
 */
export const DASHBOARD_REGISTRY: Record<UserRole, DashboardComponent> = {
  [USER_ROLES.PLATFORM_ADMIN]: PlatformAdminDashboard,
  [USER_ROLES.ADMIN]: AdminDashboard,
  [USER_ROLES.USER]: UserDashboard,
} as const;

/**
 * Gets the appropriate dashboard component for a given user role
 * Falls back to UserDashboard if role is not found in registry
 *
 * @param role - The user's role
 * @returns The dashboard component for that role
 */
export function getDashboardComponent(role: string): DashboardComponent {
  const component = DASHBOARD_REGISTRY[role as UserRole];

  if (!component) {
    console.warn(
      `No dashboard registered for role: ${role}. Falling back to UserDashboard.`,
    );
    return UserDashboard;
  }

  return component;
}

/**
 * Validates that all user roles have a registered dashboard component
 * This function can be used in tests or development to ensure completeness
 *
 * @returns true if all roles are registered, false otherwise
 */
export function validateDashboardRegistry(): boolean {
  const roles = Object.values(USER_ROLES);
  const registeredRoles = Object.keys(DASHBOARD_REGISTRY);

  const missingRoles = roles.filter((role) => !registeredRoles.includes(role));

  if (missingRoles.length > 0) {
    console.error("Missing dashboard registrations for roles:", missingRoles);
    return false;
  }

  return true;
}
