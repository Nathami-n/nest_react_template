import { userContext } from "@/context/auth-context";
import { authApi, logoutMutation } from "@/features/auth";
import { authMiddleware } from "@/middleware";
import {
  DashboardSquare01Icon,
  Logout03Icon,
  Search01Icon,
  Settings02Icon,
  Sidebar,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DashboardHeader,
  DashboardSidebar,
  DashboardWrapper,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Logo,
  useSidebar,
} from "@repo/ui/components";
import { USER_ROLES } from "@repo/validation";
import { useMutation } from "@tanstack/react-query";
import { href, Link, Outlet, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/dashboard-layout";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  if (request.method === "POST") {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "logout") {
      await authApi.logout();
      throw redirect(href("/auth/login"));
    }
  }
  return null;
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigate = useNavigate();
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  // Base navigation structure
  const getNavigation = () => {
    const baseNav = [
      {
        title: "Main",
        items: [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: (
              <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4" />
            ),
          },
        ],
      },
    ];

    // Platform Admin sees all users
    if (user?.role === USER_ROLES.PLATFORM_ADMIN) {
      return [
        ...baseNav,
        {
          title: "Platform Management",
          items: [
            {
              title: "All Users",
              href: "/dashboard/admin/users",
              icon: (
                <HugeiconsIcon icon={UserMultiple02Icon} className="size-4" />
              ),
            },
          ],
        },
        {
          title: "System",
          items: [
            {
              title: "Settings",
              href: "/dashboard/settings",
              icon: <HugeiconsIcon icon={Settings02Icon} className="size-4" />,
            },
          ],
        },
      ];
    }

    // Regular users navigation
    return [
      ...baseNav,
      {
        title: "System",
        items: [
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <HugeiconsIcon icon={Settings02Icon} className="size-4" />,
          },
        ],
      },
    ];
  };

  return (
    <DashboardSidebar
      header={
        <div className="flex border-b pb-6 items-center gap-2 px-4 sm:px-6 group-data-[collapsible=icon]:justify-center">
          <Logo
            size="sm"
            showText
            text="MyApp"
            className="group-data-[collapsible=icon]:hidden"
            onClick={() => navigate(href("/"))}
          />
          <Logo
            size="sm"
            variant="icon-only"
            className="hidden group-data-[collapsible=icon]:flex pr-2"
          />
        </div>
      }
      navigation={getNavigation()}
    >
      <DashboardContent user={user} userInitials={userInitials} />
    </DashboardSidebar>
  );
}

// Component that uses useSidebar - must be inside SidebarProvider
function DashboardContent({
  user,
  userInitials,
}: {
  user: any;
  userInitials: string;
}) {
  const { toggleSidebar } = useSidebar();
  const logout = useMutation(logoutMutation);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout.mutate();
      navigate(href("/auth/login"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex size-full flex-col overflow-hidden print:h-auto print:overflow-visible">
      <DashboardHeader
        className="print:hidden"
        start={
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <HugeiconsIcon icon={Sidebar} className="size-5" />
          </Button>
        }
        end={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Search01Icon} className="size-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-8 rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user?.imageUrl || undefined}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.email && (
                      <p className="text-muted-foreground w-50 truncate text-sm">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive justify-start w-full cursor-pointer"
                    onClick={handleLogout}
                  >
                    <HugeiconsIcon
                      icon={Logout03Icon}
                      className="mr-2 inline size-4"
                    />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="flex-1 overflow-auto print:overflow-visible print:px-0">
        <DashboardWrapper className="print:p-0 print:m-0">
          <Outlet />
        </DashboardWrapper>
      </div>
    </main>
  );
}

export const clientMiddleware = [authMiddleware];
