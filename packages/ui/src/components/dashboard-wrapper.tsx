"use client";

import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

interface DashboardWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  as?: React.ElementType;
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "p-4 sm:p-6",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10 lg:p-12",
};

function DashboardWrapper({
  children,
  className,
  maxWidth = "full",
  padding = "md",
  as: Component = "div",
}: DashboardWrapperProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </Component>
  );
}

export { DashboardWrapper };
export type { DashboardWrapperProps };
