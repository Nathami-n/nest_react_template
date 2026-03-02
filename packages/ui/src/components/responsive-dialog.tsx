"use client";

import * as React from "react";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";
import { cn } from "@repo/ui/lib/utils";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

function ResponsiveDialog({
  children,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  className,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className={className}>
          {(title || description || icon) && (
            <DrawerHeader className="text-left">
              {icon && (
                <div className="mb-2 flex items-center justify-center">
                  <div className="bg-primary/10 text-primary rounded-full p-3">
                    {icon}
                  </div>
                </div>
              )}
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}
          <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        {(title || description || icon) && (
          <DialogHeader>
            {icon && (
              <div className="mb-2 flex items-center justify-center">
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  {icon}
                </div>
              </div>
            )}
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { ResponsiveDialog };
export type { ResponsiveDialogProps };
