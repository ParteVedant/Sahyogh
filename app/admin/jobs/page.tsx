"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Sparkles, Paintbrush, Hammer, Clock, MapPin, User, Activity } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Plumbing: Wrench,
  Electrical: Zap,
  Cleaning: Sparkles,
  Painting: Paintbrush,
  Carpentry: Hammer,
};

export default function AdminJobsPage() {
  const router = useRouter();
  const { requests, workers } = useAppStore();
  const [activeTab, setActiveTab] = useState("ALL");

  const filterTabs = [
    { label: "All Jobs", value: "ALL" },
    { label: "Requested", value: "REQUESTED" },
    { label: "Assigned", value: "WORKER_ASSIGNED" },
    { label: "Accepted", value: "WORKER_ACCEPTED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Pending Payment", value: "COMPLETION_PENDING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Paid", value: "PAID" },
  ];

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "COMPLETED") return r.status === "COMPLETED" || r.status === "PAID";
    return r.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Title & Live Monitoring Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
            REAL-TIME MONITORING
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary mt-1">Jobs Console</h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-sm">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Real-time Live Sync Active</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const count = requests.filter((r) => {
            if (tab.value === "ALL") return true;
            if (tab.value === "COMPLETED") return r.status === "COMPLETED" || r.status === "PAID";
            return r.status === tab.value;
          }).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-accent text-white shadow-md"
                  : "bg-white border border-border text-text-secondary hover:text-text-primary hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Jobs List Cards */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 text-text-secondary text-sm">
            No active jobs found for the selected status filter.
          </Card>
        ) : (
          filteredRequests.map((req) => {
            const Icon = ICON_MAP[req.categoryName] || Wrench;
            const assignedWorker = workers.find((w) => w.id === req.assignedWorkerId);

            return (
              <Card
                key={req.id}
                className="p-5 hover:border-primary transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-500">{req.id}</span>
                      <h4 className="font-bold text-text-primary text-base">{req.title}</h4>
                      <span className="text-xs text-text-secondary">({req.categoryName})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {req.address.locality}, {req.address.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {req.preferredDate} ({req.preferredTimeSlot})
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-text-primary">
                        <User className="w-3.5 h-3.5 text-gray-400" /> Consumer: {req.consumerName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  {assignedWorker ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {assignedWorker.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-text-primary text-xs block">
                          {assignedWorker.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono uppercase block">
                          {assignedWorker.workerCode}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs italic text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                      Unassigned Worker
                    </span>
                  )}

                  <Badge status={req.status} />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/jobs/${req.id}`)}
                  >
                    Track Job →
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
