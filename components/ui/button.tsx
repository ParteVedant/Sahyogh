import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary",
    accent: "bg-accent text-white hover:bg-accent-hover focus:ring-accent font-bold",
    danger: "border border-danger text-danger hover:bg-red-50 focus:ring-danger",
    outline: "border border-border text-text-primary bg-white hover:bg-gray-50 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  return (
    <button
      disabled={disabled}
      suppressHydrationWarning
      className={twMerge(
        clsx(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)
      )}
      {...props}
    >
      {children}
    </button>
  );
}
