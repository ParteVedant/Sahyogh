"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Inbox,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Hammer,
  Activity,
  AlertCircle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Plumbing: Wrench,
  Electrical: Zap,
  Cleaning: Sparkles,
  Painting: Paintbrush,
  Carpentry: Hammer,
};

export default function AdminOpsDashboard() {
  const router = useRouter();
  const { requests, workers, initSupabaseData } = useAppStore();

  // Pull fresh data from Supabase every time coordinator opens the dashboard
  useEffect(() => {
    initSupabaseData();
  }, [initSupabaseData]);

  // Sort requests newest first (latest created at top of list)
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.id.localeCompare(a.id)
  );

  const newRequests = sortedRequests.filter(
    (r) => r.status === "REQUESTED" || r.status === "UNDER_REVIEW" || r.status === "ASSIGNMENT_PENDING"
  );
  const activeJobs = sortedRequests.filter(
    (r) => r.status === "WORKER_ASSIGNED" || r.status === "WORKER_ACCEPTED" || r.status === "IN_PROGRESS"
  );
  const completedToday = sortedRequests.filter(
    (r) => r.status === "COMPLETED" || r.status === "PAID"
  );
  const availableWorkers = workers.filter((w) => w.availableNow || w.status === "AVAILABLE");

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Ops Coordinator Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time cooperative service requests, active jobs &amp; worker assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-sm">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Live Operations Active</span>
        </div>
      </div>

      {/* 6 Dynamic KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: New Requests */}
        <Card className="flex flex-col justify-between p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-amber-700 font-bold">Awaiting Review</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{newRequests.length}</span>
            <span className="text-xs font-semibold text-text-secondary">New Unassigned Requests</span>
          </div>
        </Card>

        {/* Card 2: Active Jobs */}
        <Card className="flex flex-col justify-between p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-secondary font-bold">In Execution</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{activeJobs.length}</span>
            <span className="text-xs font-semibold text-text-secondary">Active Service Jobs</span>
          </div>
        </Card>

        {/* Card 3: Available Workers */}
        <Card className="flex flex-col justify-between p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">Ready for Job</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{availableWorkers.length}</span>
            <span className="text-xs font-semibold text-text-secondary">Available Workers</span>
          </div>
        </Card>

        {/* Card 4: Completed Services */}
        <Card className="flex flex-col justify-between p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">Total Finished</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{completedToday.length}</span>
            <span className="text-xs font-semibold text-text-secondary">Completed Services</span>
          </div>
        </Card>

        {/* Card 5: Total Workforce */}
        <Card className="flex flex-col justify-between p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-purple-700 font-bold">Registered Roster</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{workers.length}</span>
            <span className="text-xs font-semibold text-text-secondary">Total Cooperative Workers</span>
          </div>
        </Card>

        {/* Card 6: Pending Assignments */}
        <Card className="flex flex-col justify-between p-5 space-y-3 border-amber-300 bg-amber-50/40">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-amber-800 font-bold">Action Needed</span>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary block">{newRequests.length}</span>
            <span className="text-xs font-semibold text-amber-900 font-bold">Pending Worker Assignments</span>
          </div>
        </Card>
      </div>

      {/* Main Bottom Section: 2 Columns (New Service Requests sorted NEWEST FIRST on Left, Workforce Availability on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: New Service Requests (Sorted Newest First!) */}
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white border border-border shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-text-primary text-base">New Service Requests</h3>
                <span className="text-xs text-text-secondary">
                  Real-time incoming customer requirements (Newest listed first)
                </span>
              </div>
            </div>

            <Link
              href="/admin/requests"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              View all requests ({requests.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {newRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-secondary bg-gray-50 rounded-xl border border-gray-200">
                No new pending requests. All service requirements have been reviewed!
              </div>
            ) : (
              newRequests.map((req) => {
                const Icon = ICON_MAP[req.categoryName] || Wrench;
                const isEmergency = req.urgency === "EMERGENCY" || req.urgent;

                return (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all bg-white ${
                      isEmergency ? "border-red-300 bg-red-50/30 ring-1 ring-red-400/40" : "border-border hover:border-primary shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-secondary flex items-center justify-center shrink-0 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-gray-500">{req.id}</span>
                          <h4 className="font-bold text-text-primary text-sm">{req.title}</h4>
                          {isEmergency && (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-600" /> URGENT
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-text-secondary font-mono">
                          📍 {req.address.locality}, {req.address.city} · {req.preferredDate} ({req.preferredTimeSlot})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      <Badge status={req.status} />
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => router.push(`/admin/requests/${req.id}`)}
                        className="shadow-sm font-bold"
                      >
                        Review &amp; Assign →
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right 1 Column: Workforce Availability Overview */}
        <Card className="p-6 space-y-5 bg-white border border-border shadow-sm">
          <h3 className="font-bold text-text-primary text-base border-b border-border pb-2">
            Workforce Availability
          </h3>

          <div className="space-y-4">
            {/* Available Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-text-primary flex items-center gap-1">
                  🟢 Available Workers
                </span>
                <span className="font-mono text-text-primary font-bold">{availableWorkers.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-success h-2.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (availableWorkers.length / (workers.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Busy Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-text-primary flex items-center gap-1">
                  🔵 Active on Job
                </span>
                <span className="font-mono text-text-primary font-bold">
                  {workers.length - availableWorkers.length}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-secondary h-2.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((workers.length - availableWorkers.length) / (workers.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
