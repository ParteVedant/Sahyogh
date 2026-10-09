"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoDocumentUpload, PhotoDocument } from "@/components/ui/photo-document-upload";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
} from "lucide-react";

export default function ActiveJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, startJob, completeJob } = useAppStore();

  const reqId = resolvedParams.id;
  const request = requests.find((r) => r.id === reqId) || requests[0];

  const [notes, setNotes] = useState(request.completionNotes || "");
  const [photoDoc, setPhotoDoc] = useState<PhotoDocument | null>(null);

  const isInProgress = request.status === "IN_PROGRESS";
  const isFinished = request.status === "COMPLETION_PENDING" || request.status === "PAID" || request.status === "COMPLETED";

  const handleStart = () => {
    startJob(request.id);
  };

  const handleComplete = () => {
    if (!notes.trim()) return;
    completeJob(
      request.id,
      notes,
      photoDoc ? [photoDoc.fileDataUrl] : request.evidencePhotos || []
    );
    router.push("/worker/history");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/worker/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Jobs
        </Link>
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
          ACTIVE SERVICE EXECUTION
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Active Job Details</h1>
      </div>

      {/* Job Detail Card with Full Address & Consumer Phone Revealed */}
      <Card className="border-secondary/40 bg-blue-50/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-gray-500">{request.id}</span>
          <Badge status={request.status} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {request.categoryName} — {request.title}
          </h2>
          <p className="text-xs text-text-secondary mt-1">"{request.problemDescription}"</p>
        </div>

        {/* Revealed Full Address & Phone */}
        <div className="space-y-3 pt-3 border-t border-gray-200 text-sm">
          <div className="flex items-start gap-2 text-text-primary">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">FULL SERVICE ADDRESS (REVEALED)</span>
              <span className="text-xs text-text-secondary">
                {request.address.houseNo}, {request.address.locality}, PIN {request.address.pinCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-primary">
            <Phone className="w-5 h-5 text-success shrink-0" />
            <div>
              <span className="font-bold block">CONSUMER PHONE</span>
              <a
                href={`tel:${request.consumerPhone}`}
                className="text-xs font-bold text-secondary underline"
              >
                {request.consumerPhone} ({request.consumerName})
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-secondary pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" /> {request.preferredDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" /> {request.preferredTimeSlot}
            </span>
          </div>
        </div>
      </Card>

      {/* JOB PROGRESS Section */}
      {!isInProgress && !isFinished && (
        <Card className="space-y-3 bg-amber-50/50 border-amber-200">
          <h3 className="text-xs font-bold tracking-widest text-amber-900 uppercase">
            JOB EXECUTION
          </h3>
          <p className="text-xs text-amber-800">
            Tap below when you have arrived on site and are starting work.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
            <Play className="w-5 h-5 fill-white ml-2" /> Mark Service as Started
          </Button>
        </Card>
      )}

      {/* Completion & Execution Controls */}
      {(isInProgress || isFinished) && (
        <div className="space-y-6">
          <Card className="space-y-4 bg-white">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              COMPLETION NOTES *
            </label>

            <textarea
              rows={4}
              disabled={isFinished}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe work done — e.g. 'Replaced broken P-trap under kitchen sink, sealed joints, tested water flow for 10 minutes. No leak found.'"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {!isFinished ? (
              <PhotoDocumentUpload
                label="COMPLETION EVIDENCE / WORK PHOTO DOCUMENT (OPTIONAL)"
                documentTypes={[
                  "Work Completion Photo (After Service)",
                  "Replaced Spare Part / Invoice Receipt Photo",
                  "Before / After Comparison Photo",
                  "Consumer Signed Approval Sheet",
                ]}
                value={photoDoc}
                onChange={setPhotoDoc}
              />
            ) : (
              request.evidencePhotos && request.evidencePhotos.length > 0 && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                  ✓ Photo Evidence Attached with Completion Report
                </div>
              )
            )}

            {!isFinished ? (
              <Button
                variant="accent"
                size="lg"
                fullWidth
                disabled={!notes.trim()}
                onClick={handleComplete}
                className="shadow-md"
              >
                <CheckCircle2 className="w-5 h-5 ml-2" /> Mark Job as Completed →
              </Button>
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold text-center">
                ✓ Job marked complete. Awaiting consumer payment &amp; confirmation.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
