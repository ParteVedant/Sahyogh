import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { RequestStatus } from "../lib/types";

interface TimelineStep {
  status: RequestStatus;
  label: string;
  timestamp?: string;
  description?: string;
}

interface TimelineProps {
  currentStatus: RequestStatus;
  timeline: TimelineStep[];
}

export function Timeline({ currentStatus, timeline }: TimelineProps) {
  const allPossibleSteps: { status: RequestStatus; label: string }[] = [
    { status: "REQUESTED", label: "Request Submitted" },
    { status: "UNDER_REVIEW", label: "Admin Reviewing" },
    { status: "WORKER_ASSIGNED", label: "Worker Assigned" },
    { status: "WORKER_ACCEPTED", label: "Worker Confirmed" },
    { status: "IN_PROGRESS", label: "Work In Progress" },
    { status: "COMPLETION_PENDING", label: "Work Finished" },
    { status: "PAID", label: "Payment & Confirmed" },
  ];

  // Determine current step index
  const activeStepIndex = allPossibleSteps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="relative pl-6 border-l-2 border-border space-y-6">
      {allPossibleSteps.map((step, idx) => {
        const matchingLog = timeline.find((t) => t.status === step.status);
        const isCompleted = idx <= (activeStepIndex >= 0 ? activeStepIndex : timeline.length - 1);
        const isCurrent = step.status === currentStatus;

        return (
          <div key={step.status} className="relative group">
            {/* Step Icon Indicator */}
            <div
              className={`absolute -left-[31px] top-0.5 rounded-full bg-white p-0.5 transition-colors ${
                isCurrent
                  ? "text-accent ring-4 ring-amber-100"
                  : isCompleted
                  ? "text-success"
                  : "text-gray-300"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 fill-success text-white" />
              ) : isCurrent ? (
                <Clock className="w-5 h-5 text-accent animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-semibold ${
                    isCompleted || isCurrent ? "text-text-primary" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </h4>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    Active
                  </span>
                )}
              </div>

              {matchingLog?.timestamp && (
                <p className="text-xs text-text-secondary mt-0.5">{matchingLog.timestamp}</p>
              )}

              {matchingLog?.description && (
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1.5 font-sans">
                  {matchingLog.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
