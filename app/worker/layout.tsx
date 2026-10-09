"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, PlayCircle, History, Star } from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { Badge } from "@/components/ui/badge";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { workers, requests, currentUser } = useAppStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  let savedUserId = "";
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("sahyog_current_user");
      if (saved) savedUserId = JSON.parse(saved)?.id || "";
    } catch (e) {}
  }

  const activeId = currentUser?.id || savedUserId;
  const worker =
    (mounted &&
      workers.find(
        (w) =>
          w.id === activeId ||
          w.name.toLowerCase() === currentUser?.fullName?.toLowerCase() ||
          w.workerCode === activeId ||
          w.phone === currentUser?.phone
      )) ||
    workers[0];

  const activeJob = requests.find(
    (r) =>
      (r.assignedWorkerId === worker.id || r.assignedWorkerName === worker.name) &&
      (r.status === "WORKER_ACCEPTED" || r.status === "IN_PROGRESS" || r.status === "SCHEDULED")
  ) || requests[1];

  const activeJobId = activeJob ? activeJob.id : "REQ-1002";

  const tabs = [
    { label: "Jobs", href: "/worker/jobs", icon: HardHat },
    { label: "Active", href: `/worker/active/${activeJobId}`, icon: PlayCircle },
    { label: "History", href: "/worker/history", icon: History },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Worker Identity Header Card */}
      <div className="bg-primary text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4" suppressHydrationWarning>
        <div className="flex items-center gap-4" suppressHydrationWarning>
          <div className="w-14 h-14 rounded-full bg-accent text-white font-bold text-2xl flex items-center justify-center shadow" suppressHydrationWarning>
            {worker.name.charAt(0)}
          </div>
          <div suppressHydrationWarning>
            <div className="flex items-center gap-2 flex-wrap" suppressHydrationWarning>
              <h2 className="text-xl font-bold" suppressHydrationWarning>{worker.name}</h2>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-gray-200" suppressHydrationWarning>
                {worker.workerCode}
              </span>
              <Badge variant="verified" />
            </div>
            <p className="text-xs text-gray-300 mt-0.5" suppressHydrationWarning>{worker.societyName}</p>
            <p className="text-xs text-gray-300" suppressHydrationWarning>Areas: {worker.serviceAreas.join(", ")}</p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10" suppressHydrationWarning>
          <div className="flex items-center gap-1 font-bold text-accent text-lg" suppressHydrationWarning>
            <Star className="w-5 h-5 fill-accent" /> {worker.rating} ★
          </div>
          <span className="text-xs text-gray-300" suppressHydrationWarning>{worker.jobsCompleted} Jobs Completed</span>
        </div>
      </div>

      {/* Worker Horizontal Tab Bar */}
      <nav className="bg-white border border-border rounded-xl shadow-sm overflow-x-auto">
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
