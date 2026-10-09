"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function AssignmentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests } = useAppStore();

  const request = requests.find((r) => r.id === resolvedParams.id) || requests[0];

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
          ASSIGNMENT CONFIRMED · {request.id}
        </span>
        <h1 className="text-3xl font-extrabold text-text-primary">Worker Assigned</h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          <strong className="text-primary">{request.assignedWorkerName || "Selected Worker"}</strong> has been assigned to request <strong>{request.id}</strong>. The worker has been notified and must confirm acceptance.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/admin/requests")}
        >
          <ArrowLeft className="w-5 h-5 ml-2" /> Back to Requests Queue
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/monitor")}
        >
          View Job Monitoring
        </Button>
      </div>
    </div>
  );
}
