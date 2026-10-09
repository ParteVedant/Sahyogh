import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RequestStatus } from "../../lib/types";
import { REQUEST_STATUS_CONFIG } from "../../lib/constants/colors";

interface BadgeProps {
  children?: React.ReactNode;
  status?: RequestStatus;
  variant?: "verified" | "urgent" | "new" | "custom";
  className?: string;
}

export function Badge({ children, status, variant, className }: BadgeProps) {
  if (status) {
    const config = REQUEST_STATUS_CONFIG[status] || {
      label: status,
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    };
    return (
      <span
        className={twMerge(
          clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            config.bg,
            config.text,
            config.border,
            className
          )
        )}
      >
        {config.label}
      </span>
    );
  }

  if (variant === "verified") {
    return (
      <span className={twMerge(clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-success text-white", className))}>
        ✓ VERIFIED
      </span>
    );
  }

  if (variant === "urgent") {
    return (
      <span className={twMerge(clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-danger text-white animate-pulse", className))}>
        ⚡ URGENT
      </span>
    );
  }

  if (variant === "new") {
    return (
      <span className={twMerge(clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-accent text-white", className))}>
        NEW ASSIGNMENT
      </span>
    );
  }

  return (
    <span
      className={twMerge(
        clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200", className)
      )}
    >
      {children}
    </span>
  );
}
