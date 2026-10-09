"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Requests", href: "/admin/requests", icon: Inbox },
    { label: "Workers", href: "/admin/workers", icon: Users },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background w-full">
      {/* Setu Ops Console Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col justify-between p-6 shrink-0 border-r border-white/10 shadow-xl">
        <div className="space-y-8">
          {/* Header Branding */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt="Sahyog Logo"
              className="w-9 h-9 rounded-xl bg-white p-0.5 object-contain shadow-md"
            />
            <div>
              <h2 className="font-extrabold text-sm tracking-wider uppercase">SETU COOPERATIVE</h2>
              <span className="text-[10px] text-gray-300 tracking-widest font-mono uppercase block">
                OPS CONSOLE V1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow border border-white/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <Link href="/admin/profile" className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors">
            <Settings className="w-4 h-4" /> Cooperative Settings &amp; Profile
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 space-y-6">
        {/* Ops Console Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-widest">
            OVERVIEW
          </span>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-mono font-semibold text-text-secondary">
              THU · 27 AUG
            </span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
