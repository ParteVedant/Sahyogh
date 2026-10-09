"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CheckCircle2, Star, Sparkles, ArrowLeft, User } from "lucide-react";

export default function AdminSmartWorkerAllocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, workers, assignWorker } = useAppStore();

  const reqId = resolvedParams.id;
  const req = requests.find((r) => r.id === reqId) || requests[0];

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recommended worker: pick first AVAILABLE worker or first worker
  const availableWorkers = workers.filter((w) => w.status === "AVAILABLE");
  const recommendedWorker = availableWorkers[0] || workers[0];
  const otherWorkers = workers.filter((w) => w.id !== recommendedWorker?.id);

  const handleApprove = (workerId: string) => {
    assignWorker(reqId, workerId);
    router.push(`/admin/assign/${reqId}/success`);
  };

  if (!req) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Request Not Found</h2>
        <Link href="/admin/requests" className="text-xs font-bold text-primary hover:underline">
          ← Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <Link
          href={`/admin/requests/${reqId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Request Details
        </Link>
        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
          REQUESTS / #{reqId} / ALLOCATE
        </span>
        <h1 className="text-2xl font-extrabold text-text-primary mt-1">
          Smart Worker Allocation
        </h1>
      </div>

      {/* Top Banner Bar */}
      <div className="bg-primary text-white p-3.5 rounded-xl font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow">
        <span className="font-bold">
          #{req.id} · {req.categoryName} · {req.address?.locality || "Thane"} · {req.preferredDate || "Today"} · {req.consumerName || "Customer"}
        </span>
        <span className="text-accent font-bold uppercase tracking-wider">
          MATCHING ENGINE V2
        </span>
      </div>

      {/* System Recommendation Card */}
      {recommendedWorker && (
        <Card className="p-6 sm:p-8 border-2 border-accent/60 bg-amber-50/20 space-y-6 shadow-md">
          <div className="flex items-center gap-1 text-xs font-bold text-accent uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-accent" /> SYSTEM RECOMMENDATION
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white font-black text-xl flex items-center justify-center shadow">
                  {recommendedWorker.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-text-primary">
                      {recommendedWorker.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      recommendedWorker.status === "AVAILABLE"
                        ? "bg-emerald-100 text-success border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      ● {recommendedWorker.status === "AVAILABLE" ? "Available now" : "Busy"}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 font-medium">
                    {recommendedWorker.skills.join(", ")} · {recommendedWorker.societyName}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-text-primary pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Skills: {recommendedWorker.skills.join(", ")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Rating: {recommendedWorker.rating} ★ ({recommendedWorker.jobsCompleted} jobs)</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Service area: {recommendedWorker.serviceAreas.join(", ")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Contact: {recommendedWorker.phone}</span>
                </div>
              </div>
            </div>

            {/* Circular Match Score Gauge */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-accent/40 shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#F6A623"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251"
                    strokeDashoffset="22"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-text-primary block leading-none">
                    95%
                  </span>
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">
                    MATCH SCORE
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-secondary mt-2 underline">
                Top Recommendation
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={() => handleApprove(recommendedWorker.id)}
              className="shadow-md"
            >
              ✓ Approve &amp; Assign {recommendedWorker.name}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(`/admin/workers/${recommendedWorker.id}`)}
            >
              View Profile
            </Button>
          </div>
        </Card>
      )}

      {/* Other Eligible Workers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            OTHER ELIGIBLE WORKERS ({otherWorkers.length})
          </h3>
          <span className="text-[11px] font-mono text-gray-400 uppercase">
            AVAILABLE IN COOPERATIVE FEDERATION
          </span>
        </div>

        {otherWorkers.map((worker) => (
          <Card
            key={worker.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-all bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-text-primary font-bold flex items-center justify-center text-sm">
                {worker.name.split(" ").map((n) => n[0]).join("")}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-text-primary text-base">{worker.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    worker.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {worker.status}
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-mono">
                  {worker.skills.join(", ")} · {worker.societyName}
                </p>
                <div className="flex items-center gap-3 text-xs mt-0.5">
                  <span className="flex items-center gap-1 font-bold text-accent">
                    <Star className="w-3.5 h-3.5 fill-accent" /> {worker.rating}
                  </span>
                  <span className="text-gray-400 font-mono">({worker.jobsCompleted} jobs)</span>
                  <span className="text-gray-400 font-mono">📍 {worker.serviceAreas.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(worker.id)}
              >
                Assign {worker.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
