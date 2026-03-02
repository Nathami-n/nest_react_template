"use client";

import * as React from "react";
import { cn } from "@repo/ui/lib/utils";
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@repo/ui/components/sidebar";

interface SidebarNavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  items?: SidebarNavSubItem[];
  onClick?: () => void;
}

interface SidebarNavSubItem {
  title: string;
  href: string;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

interface SidebarNavGroup {
  title?: string;
  items: SidebarNavItem[];
}

interface DashboardSidebarProps {
  children?: React.ReactNode;
  navigation: SidebarNavGroup[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  collapsible?: "offcanvas" | "icon" | "none";
  defaultOpen?: boolean;
}

function DashboardSidebar({
  children,
  navigation,
  header,
  footer,
  className,
  collapsible = "icon",
  defaultOpen = true,
}: DashboardSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <BaseSidebar collapsible={collapsible} className={className}>
        {header && <SidebarHeader>{header}</SidebarHeader>}

        <SidebarContent>
          {navigation.map((group, groupIndex) => (
            <SidebarGroup key={groupIndex}>
              {group.title && (
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item, itemIndex) => (
                    <SidebarMenuItem key={itemIndex}>
                      <SidebarNavItemComponent item={item} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {footer}

        <SidebarRail />
      </BaseSidebar>

      {children}
    </SidebarProvider>
  );
}

function SidebarNavItemComponent({ item }: { item: SidebarNavItem }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const button = (
    <SidebarMenuButton
      asChild={!!item.href}
      isActive={item.isActive}
      onClick={item.onClick}
      tooltip={isCollapsed ? item.title : undefined}
    >
      {item.href ? (
        <a href={item.href}>
          {item.icon}
          <span>{item.title}</span>
          {item.badge && (
            <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
              {item.badge}
            </span>
          )}
        </a>
      ) : (
        <button>
          {item.icon}
          <span>{item.title}</span>
          {item.badge && (
            <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
              {item.badge}
            </span>
          )}
        </button>
      )}
    </SidebarMenuButton>
  );

  if (item.items && item.items.length > 0) {
    return (
      <>
        {button}
        <SidebarMenuSub>
          {item.items.map((subItem, subIndex) => (
            <SidebarMenuSubItem key={subIndex}>
              <SidebarMenuSubButton
                asChild
                isActive={subItem.isActive}
                onClick={subItem.onClick}
              >
                <a href={subItem.href}>
                  <span>{subItem.title}</span>
                  {subItem.badge && (
                    <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
                      {subItem.badge}
                    </span>
                  )}
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </>
    );
  }

  return button;
}

export { DashboardSidebar, SidebarTrigger };
export type {
  DashboardSidebarProps,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavSubItem,
};
