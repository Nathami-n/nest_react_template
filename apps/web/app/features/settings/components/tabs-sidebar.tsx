import {
  User02FreeIcons,
  SecurityPasswordIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@repo/ui/components";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";
import { NavLink } from "react-router";

const tabsSidebarConfig = [
  {
    name: "Profile",
    href: "/dashboard/settings/profile",
    icon: <HugeiconsIcon icon={User02FreeIcons} />,
  },
  {
    name: "Security",
    href: "/dashboard/settings/security",
    icon: <HugeiconsIcon icon={SecurityPasswordIcon} />,
  },
];

export function TabsSidebar() {
  return (
    <>
      {/* Mobile View: Horizontal Tabs */}
      <div className="md:hidden -mx-4 px-4 border-b overflow-x-auto no-scrollbar">
        <nav className="flex space-x-6 min-w-max">
          {tabsSidebarConfig.map((tab) => (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) =>
                cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )
              }
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop View: Sidebar */}
      <div className="hidden md:flex flex-col gap-2">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        </div>
        <Separator className="my-2" />
        <nav className="flex flex-col gap-1">
          {tabsSidebarConfig.map((tab) => (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive && "bg-primary/10 text-primary",
                  "w-full justify-start",
                )
              }
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.name}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
