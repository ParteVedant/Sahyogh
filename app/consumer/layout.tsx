"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ClipboardList, CreditCard, Star } from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { requests } = useAppStore();

  const activeRequest = requests.find(
    (r) => r.status !== "PAID" && r.status !== "CLOSED" && r.status !== "CANCELLED"
  ) || requests[0];

  const activeReqId = activeRequest ? activeRequest.id : "REQ-1001";

  const tabs = [
    { label: "Home", href: "/consumer/dashboard", icon: Home },
    { label: "Browse", href: "/consumer/browse", icon: Grid },
    { label: "Track", href: `/consumer/track/${activeReqId}`, icon: ClipboardList },
    { label: "Pay", href: `/consumer/pay/${activeReqId}`, icon: CreditCard },
    { label: "Rate", href: `/consumer/rate/${activeReqId}`, icon: Star },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Consumer Sub-navbar Tab Bar */}
      <nav className="bg-white border border-border rounded-xl mb-6 shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-1 p-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
