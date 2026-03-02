import type { ClassNameValue } from "tailwind-merge";
import { cn } from "../lib/utils";

import * as React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    titleClassName?: ClassNameValue;
    descriptionClassName?: ClassNameValue;
    children?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    titleClassName,
    descriptionClassName,
    className,
    children,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4", className)} {...props}>
            <div>
                <h1 className={cn("text-3xl font-bold tracking-tight", titleClassName)}>{title}</h1>
                {description && (
                    <p className={cn("text-muted-foreground mt-1", descriptionClassName)}>{description}</p>
                )}
            </div>
            {children && <div className="shrink-0">{children}</div>}
        </div>
    )
}