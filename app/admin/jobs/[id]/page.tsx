"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/timeline";
import { ArrowLeft, Phone, MapPin, Calendar, Clock, Activity, User, Wrench } from "lucide-react";

export default function AdminJobTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, workers } = useAppStore();

  const jobId = resolvedParams.id;
  const request = requests.find((r) => r.id === jobId) || requests[0];
  const assignedWorker = workers.find((w) => w.id === request?.assignedWorkerId);

  if (!request) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Job Request Not Found</h2>
        <Button variant="outline" onClick={() => router.push("/admin/jobs")}>
          Return to Jobs List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs Console
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
              REAL-TIME JOB TRACKING / #{request.id}
            </span>
            <h1 className="text-2xl font-extrabold text-text-primary mt-1">{request.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Live Tracking
            </div>
            <Badge status={request.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Job Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-secondary border border-blue-200 uppercase">
                ● {request.categoryName}
              </span>
              <span className="text-xs font-mono font-bold text-gray-400">
                ID: {request.id}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-text-primary">
                {request.title}
              </h2>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed bg-gray-50 p-3 rounded-lg border border-border">
                "{request.problemDescription}"
              </p>
            </div>

            <div className="space-y-3 text-xs border-t border-b border-gray-100 py-4 font-semibold">
              <div className="grid grid-cols-3 py-1">
                <span className="font-mono text-gray-400 uppercase text-[10px]">
                  CUSTOMER
                </span>
                <span className="col-span-2 font-bold text-text-primary">
                  {request.consumerName} ({request.consumerPhone || "No Phone"})
                </span>
              </div>

              <div className="grid grid-cols-3 py-1">
                <span className="font-mono text-gray-400 uppercase text-[10px]">
                  SERVICE CATEGORY
                </span>
                <span className="col-span-2 font-bold text-text-primary">
                  {request.categoryName}
                </span>
              </div>

              <div className="grid grid-cols-3 py-1">
                <span className="font-mono text-gray-400 uppercase text-[10px]">
                  ASSIGNED WORKER
                </span>
                <span className="col-span-2 font-bold text-text-primary">
                  {assignedWorker ? `${assignedWorker.name} (${assignedWorker.workerCode})` : "Unassigned"}
                </span>
              </div>

              <div className="grid grid-cols-3 py-1">
                <span className="font-mono text-gray-400 uppercase text-[10px]">
                  SERVICE LOCATION
                </span>
                <span className="col-span-2 font-bold text-text-primary">
                  {request.address.houseNo}, {request.address.locality}, {request.address.city} - {request.address.pinCode}
                </span>
              </div>

              <div className="grid grid-cols-3 py-1">
                <span className="font-mono text-gray-400 uppercase text-[10px]">
                  PREFERRED SCHEDULE
                </span>
                <span className="col-span-2 font-bold text-text-primary">
                  {request.preferredDate} ({request.preferredTimeSlot})
                </span>
              </div>
            </div>

            {/* WORKER NOTES & EVIDENCE */}
            {request.completionNotes && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase block">
                  WORKER COMPLETION REPORT & NOTES
                </span>
                <p className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-sm text-text-primary leading-relaxed">
                  "{request.completionNotes}"
                </p>

                {request.evidencePhotos && request.evidencePhotos.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-text-secondary block mb-1">
                      Photo Evidence Attached:
                    </span>
                    <div className="flex gap-2">
                      {request.evidencePhotos.map((photo, i) => (
                        <div key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                          ✓ Photo Evidence #{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {assignedWorker && (
              <a href={`tel:${assignedWorker.phone}`} className="block">
                <Button variant="accent" size="lg" fullWidth className="shadow-md py-3.5">
                  <Phone className="w-4 h-4 ml-2" /> Contact Worker ({assignedWorker.phone})
                </Button>
              </a>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Dynamic Job Status Timeline */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-text-primary text-sm">Live Job Timeline</h3>
              <Badge status={request.status} />
            </div>

            <Timeline currentStatus={request.status} timeline={request.timeline || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
