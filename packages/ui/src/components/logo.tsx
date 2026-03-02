"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface LogoProps {
  src?: string;
  alt?: string;
  icon?: React.ReactNode;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  text?: string;
  variant?: "default" | "icon-only";
  onClick?: () => void;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const DefaultLogoSvg = ({ className }: { className?: string }) => (
  <svg
    data-logo="logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    className={className}
  >
    <g id="logogram" transform="translate(0, 0) rotate(0)">
      <path
        d="M30 28V12C30 10.8954 29.1046 10 28 10H27.8994C27.369 10 26.8604 10.2109 26.4854 10.5859L10.5859 26.4854C10.2109 26.8604 10 27.369 10 27.8994V40H0V27.8994C2.15312e-05 24.7168 1.26423 21.6645 3.51465 19.4141L19.4141 3.51465C21.6645 1.26423 24.7168 2.1373e-05 27.8994 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H14V30H28C29.1046 30 30 29.1046 30 28Z M0 0H17L7 10H0V0Z"
        fill="currentColor"
      />
    </g>
    <g id="logotype" transform="translate(40, 20)"></g>
  </svg>
);

function Logo({
  src,
  alt = "Logo",
  icon,
  fallbackIcon,
  fallbackText,
  size = "md",
  className,
  showText = false,
  text,
  variant = "default",
  onClick
}: LogoProps) {
  const renderLogoContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className={cn("object-contain", sizeClasses[size])}
        />
      );
    }

    if (icon || fallbackIcon) {
      return (
        <div className={cn(sizeClasses[size], "shrink-0")}>
          {icon || fallbackIcon}
        </div>
      );
    }

    if (fallbackText) {
      return (
        <span className={cn("font-bold", textSizeClasses[size])}>
          {fallbackText}
        </span>
      );
    }

    return (
      <DefaultLogoSvg
        className={cn("text-primary", sizeClasses[size], "shrink-0")}
      />
    );
  };

  if (variant === "icon-only") {
    return (
      <div className={cn("flex items-center", className)}>
        {renderLogoContent()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {renderLogoContent()}
      {showText && text && (
        <span className={cn("font-semibold", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

export { Logo };
export type { LogoProps };
