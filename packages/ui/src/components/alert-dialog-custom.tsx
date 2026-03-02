import * as React from "react";
import { ResponsiveDialog } from "@repo/ui/components/responsive-dialog";
import { Button } from "@repo/ui/components/button";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@repo/ui/lib/utils";

interface AlertDialogCustomProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  variant?: "warning" | "danger" | "info";
  cancelLabel?: string;
  actionLabel?: string;
  onCancel?: () => void;
  onAction?: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  warning: {
    iconBg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
  },
  danger: {
    iconBg: "bg-destructive/10 dark:bg-destructive/20",
    iconColor: "text-destructive",
  },
  info: {
    iconBg: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
  },
};

function AlertDialogCustom({
  open,
  onOpenChange,
  trigger,
  title = "Are you sure?",
  message,
  icon,
  variant = "warning",
  cancelLabel = "Cancel",
  actionLabel = "Continue",
  onCancel,
  onAction,
  isLoading = false,
  disabled = false,
  className,
}: AlertDialogCustomProps) {
  const [isExecuting, setIsExecuting] = React.useState(false);
  const styles = variantStyles[variant];
  const defaultIcon = <HugeiconsIcon icon={Alert01Icon} className="size-6" />;

  const handleAction = async () => {
    if (!onAction) return;

    try {
      setIsExecuting(true);
      await onAction();
      onOpenChange?.(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const loading = isLoading || isExecuting;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      className={className}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "rounded-full p-3 shrink-0",
              styles.iconBg,
              styles.iconColor,
            )}
          >
            {icon || defaultIcon}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-center leading-none tracking-tight">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm text-center leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="sm:min-w-24"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={handleAction}
            disabled={disabled || loading}
            className="sm:min-w-24"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Processing...</span>
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

export { AlertDialogCustom };
export type { AlertDialogCustomProps };
