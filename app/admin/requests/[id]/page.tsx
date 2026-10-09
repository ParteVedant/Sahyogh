"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Circle,
  Phone,
  ImageIcon,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, workers } = useAppStore();

  const reqId = resolvedParams.id;
  const req = requests.find((r) => r.id === reqId) || requests[0];
  const assignedWorker = workers.find((w) => w.id === req?.assignedWorkerId);

  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string } | null>(null);

  if (!req) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Request Not Found</h2>
        <p className="text-xs text-text-secondary">Request ID #{reqId} does not exist.</p>
        <Link href="/admin/requests" className="text-xs font-bold text-primary hover:underline">
          ← Back to Requests
        </Link>
      </div>
    );
  }

  const isAssigned =
    req.status === "WORKER_ASSIGNED" ||
    req.status === "WORKER_ACCEPTED" ||
    req.status === "IN_PROGRESS" ||
    req.status === "COMPLETION_PENDING" ||
    req.status === "COMPLETED" ||
    req.status === "PAID";

  const urgencyLabel = req.urgency || (req.urgent ? "EMERGENCY" : "NORMAL");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Service Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Request Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 bg-white">
            {/* Header badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                  ● {req.categoryName}
                </span>
                {urgencyLabel === "EMERGENCY" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" /> 🔴 Emergency Dispatch
                  </span>
                ) : urgencyLabel === "HIGH" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                    🟡 Priority Dispatch
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    🟢 Normal Urgency
                  </span>
                )}
              </div>

              <span className="text-xs font-mono font-bold text-gray-400">
                REQUEST #{req.id}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-text-primary">{req.title}</h1>

            {/* 4 Metadata Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">
                  CUSTOMER
                </span>
                <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" /> {req.consumerName || "Customer"}
                </span>
                {req.consumerPhone && (
                  <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {req.consumerPhone}
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">
                  LOCATION
                </span>
                <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" /> {req.address?.locality || req.address?.city || "Thane"}, {req.address?.city || "Mumbai"}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">
                  DATE &amp; TIME
                </span>
                <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" /> {req.preferredDate || "Today"} · {req.preferredTimeSlot || "Morning"}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">
                  URGENCY LEVEL
                </span>
                <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-gray-400" /> {urgencyLabel}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase block">
                PROBLEM DESCRIPTION
              </span>
              <p className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl text-sm text-text-primary leading-relaxed font-medium">
                "{req.problemDescription || req.title}"
              </p>
            </div>

            {/* BEFORE WORK PHOTO VIEW (SENT BY CONSUMER) */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primary" /> BEFORE WORK PHOTO EVIDENCE (CONSUMER SUBMISSION)
                </span>
                <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Site / Issue Photo
                </span>
              </div>

              {req.evidencePhotos && req.evidencePhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {req.evidencePhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-between gap-3 hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {photoUrl.startsWith("data:image/") ? (
                          <img
                            src={photoUrl}
                            alt="Before Work Photo"
                            className="w-12 h-12 object-cover rounded-lg border border-gray-300 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-100 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            📷
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-text-primary block truncate">
                            Before Work Photo #{idx + 1}
                          </span>
                          <span className="text-[10px] text-gray-400 block font-mono">
                            Uploaded by Consumer
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActivePhotoModal({
                            url: photoUrl,
                            title: `Before Work Photo (Consumer) — Request #${req.id}`,
                          })
                        }
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Photo
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-text-secondary text-center">
                  📷 No before work photo submitted by consumer for this request.
                </div>
              )}
            </div>

            {/* AFTER WORK PHOTO VIEW (SENT BY WORKER) */}
            {req.completionNotes && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-500 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AFTER WORK PHOTO EVIDENCE (WORKER COMPLETION)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Finished Work Photo
                  </span>
                </div>

                <p className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                  <strong>Worker Notes:</strong> "{req.completionNotes}"
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Next Step & Timeline */}
        <div className="space-y-6">
          {/* Next Step CTA Card */}
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="font-bold text-text-primary text-sm">Next Step</h3>
            {isAssigned ? (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Worker <strong className="text-primary">{assignedWorker?.name || req.assignedWorkerName || "Assigned Worker"}</strong> has been allocated to this request.
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Status: {req.status}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Run the matching model to find workers who are skilled, available and nearby.
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={() => router.push(`/admin/requests/${req.id}/allocate`)}
                  className="shadow-md"
                >
                  Find Suitable Workers <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </Card>

          {/* Request Timeline Card */}
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="font-bold text-text-primary text-sm border-b border-border pb-2">
              Request Timeline
            </h3>

            <div className="space-y-4 relative pl-5 border-l-2 border-border">
              {/* Step 1 */}
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-success absolute -left-[25px] top-0 bg-white" />
                <span className="font-bold text-xs text-text-primary block">Request received</span>
                <span className="text-[11px] font-mono text-gray-400 block">{req.createdAt?.slice(0, 10) || "Today"}</span>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-success absolute -left-[25px] top-0 bg-white" />
                <span className="font-bold text-xs text-text-primary block">Categorized as {req.categoryName}</span>
                <span className="text-[11px] font-mono text-gray-400 block">{req.createdAt?.slice(0, 10) || "Today"}</span>
              </div>

              {/* Step 3 */}
              <div className="relative">
                {isAssigned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-success absolute -left-[25px] top-0 bg-white" />
                    <span className="font-bold text-xs text-emerald-800 block">Worker Assigned</span>
                    <span className="text-[11px] font-mono text-emerald-700 block">{assignedWorker?.name || "Assigned Worker"}</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-accent absolute -left-[25px] top-0 bg-white fill-amber-100" />
                    <span className="font-bold text-xs text-amber-800 block">Awaiting worker assignment</span>
                    <span className="text-[11px] font-mono text-amber-700 block">In progress</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FULL PHOTO VIEW MODAL */}
      {activePhotoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-text-primary text-sm">{activePhotoModal.title}</h3>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-gray-100 rounded-xl p-2 max-h-[70vh] overflow-hidden">
              {activePhotoModal.url.startsWith("data:image/") ? (
                <img
                  src={activePhotoModal.url}
                  alt="Full Evidence Photo"
                  className="max-h-[65vh] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="p-12 text-center space-y-2">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                  <span className="text-xs font-bold text-gray-600 block">Sample Evidence Document Photo</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setActivePhotoModal(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
