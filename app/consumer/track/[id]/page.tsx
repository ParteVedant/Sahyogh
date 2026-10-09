"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/timeline";
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock, Star } from "lucide-react";

export default function ConsumerTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, workers } = useAppStore();

  const initialId = resolvedParams.id;
  const request = requests.find((r) => r.id === initialId) || requests[0];
  const assignedWorker = workers.find((w) => w.id === request?.assignedWorkerId);

  if (!request) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-text-primary">Service Request Not Found</h2>
        <p className="text-xs text-text-secondary">
          Request ID #{initialId} was not found or has been removed.
        </p>
        <Button variant="accent" onClick={() => router.push("/consumer/dashboard")}>
          Return to Consumer Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/consumer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-mono text-text-secondary uppercase tracking-widest">
              REQUEST TRACKING #{request.id}
            </span>
            <h1 className="text-2xl font-bold text-text-primary mt-1">
              {request.categoryName} — {request.title}
            </h1>
          </div>
          <Badge status={request.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline & Requirement */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
              REQUEST TIMELINE
            </h3>
            <Timeline currentStatus={request.status} timeline={request.timeline || []} />
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
              REQUIREMENT DETAILS
            </h3>

            <div className="space-y-2 text-sm">
              <span className="font-bold text-text-primary block">Problem Description:</span>
              <p className="p-3 bg-gray-50 rounded-lg border border-border text-xs text-text-secondary">
                "{request.problemDescription}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100">
              <div>
                <span className="text-text-secondary block">Preferred Date:</span>
                <span className="font-bold text-text-primary flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> {request.preferredDate}
                </span>
              </div>

              <div>
                <span className="text-text-secondary block">Time Slot:</span>
                <span className="font-bold text-text-primary flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> {request.preferredTimeSlot}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Assigned Worker & Next Actions */}
        <div className="space-y-6">
          {assignedWorker ? (
            <Card className="space-y-4 bg-blue-50/30 border-secondary/30">
              <h3 className="text-xs font-bold tracking-widest text-secondary uppercase">
                ASSIGNED WORKER
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-base shadow">
                  {assignedWorker.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">{assignedWorker.name}</h4>
                  <Badge variant="verified" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-text-secondary pt-2 border-t border-gray-200">
                <p>📍 Society: {assignedWorker.societyName}</p>
                <div className="flex items-center gap-1 font-bold text-accent">
                  <Star className="w-4 h-4 fill-accent" /> {assignedWorker.rating} ★ ({assignedWorker.jobsCompleted} jobs)
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-2 bg-amber-50/50 border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm">Review &amp; Assignment Pending</h4>
              <p className="text-xs text-amber-800">
                A Cooperative Society Administrator is currently reviewing your request and matching an available worker.
              </p>
            </Card>
          )}

          {/* Action CTAs based on status */}
          {(request.status === "COMPLETION_PENDING" || request.status === "PAID") && (
            <Card className="space-y-3">
              <h4 className="font-bold text-text-primary text-sm">Service Completion</h4>
              <p className="text-xs text-text-secondary">
                Worker has submitted job completion notes. Confirm and process payment.
              </p>
              <Link href={`/consumer/pay/${request.id}`}>
                <Button variant="accent" size="md" fullWidth>
                  Proceed to Payment →
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
