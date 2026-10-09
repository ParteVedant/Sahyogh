import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}

export function Card({ children, className, selected, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white border rounded-xl p-5 transition-all duration-150 shadow-sm",
          selected ? "border-primary ring-2 ring-primary/10 shadow-md" : "border-border hover:border-gray-300",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
