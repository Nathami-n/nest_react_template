"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

interface DashboardHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  disabled?: boolean;
  loading?: boolean;
  hideLabel?: boolean; // Hide label on all screens, show only icon
  hideLabelOnMobile?: boolean; // Hide label on mobile, show on desktop
}

interface DashboardHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  breadcrumbs?: DashboardHeaderBreadcrumb[];
  actions?: DashboardHeaderAction[];
  start?: React.ReactNode;
  end?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  showSeparator?: boolean;
}

function DashboardHeader({
  breadcrumbs,
  actions,
  start,
  end,
  children,
  className,
  sticky = false,
  showSeparator = true,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "min-h-14.25 sm:min-h-16.25",
        showSeparator && "border-b",
        sticky && "bg-background sticky top-0 z-10",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="border-b px-4 py-2 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="flex items-center px-4 sm:px-6">
        <div
          className={cn(
            "flex w-full flex-wrap items-center gap-2 py-3 sm:gap-3 sm:py-4",
            start ? "justify-between" : "justify-end",
          )}
        >
          {start && (
            <div className="flex items-center gap-2 sm:gap-3">{start}</div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {actions && actions.length > 0 && (
              <>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    size={
                      action.hideLabel || action.hideLabelOnMobile
                        ? "icon"
                        : "default"
                    }
                    className={cn(
                      action.hideLabelOnMobile && "sm:h-8 sm:w-auto sm:px-2.5",
                    )}
                  >
                    {action.loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        {!action.hideLabel && (
                          <span
                            className={cn(
                              action.hideLabelOnMobile && "hidden sm:inline",
                            )}
                          >
                            {action.label}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {action.icon}
                        {!action.hideLabel && (
                          <span
                            className={cn(
                              action.hideLabelOnMobile && "hidden sm:inline",
                            )}
                          >
                            {action.label}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                ))}
              </>
            )}
            {end}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export { DashboardHeader };
export type {
  DashboardHeaderAction,
  DashboardHeaderBreadcrumb, DashboardHeaderProps
};
