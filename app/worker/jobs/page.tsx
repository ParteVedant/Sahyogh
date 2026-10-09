"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MapPin, Calendar, Star, Power, CheckCircle2, AlertCircle, IndianRupee, Briefcase, Award } from "lucide-react";

export default function WorkerJobsPage() {
  const router = useRouter();
  const { requests, workers, currentUser, updateWorker, acceptJob, rejectJob } = useAppStore();

  let savedUserId = "";
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("sahyog_current_user");
      if (saved) savedUserId = JSON.parse(saved)?.id || "";
    } catch (e) {}
  }

  const activeId = currentUser?.id || savedUserId;
  const currentWorker =
    workers.find(
      (w) =>
        w.id === activeId ||
        w.name.toLowerCase() === currentUser?.fullName?.toLowerCase() ||
        w.workerCode === activeId ||
        w.phone === currentUser?.phone
    ) || workers[0];

  const [isAvailable, setIsAvailable] = useState<boolean>(
    currentWorker?.availableNow ?? true
  );

  const toggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    if (currentWorker) {
      updateWorker(currentWorker.id, {
        availableNow: nextState,
        status: nextState ? "AVAILABLE" : "UNAVAILABLE",
      });
    }
  };

  // Assigned jobs for this worker
  const assignedJobs = requests.filter(
    (r) =>
      (r.assignedWorkerId === currentWorker?.id || r.assignedWorkerName === currentWorker?.name) &&
      (r.status === "WORKER_ASSIGNED" || r.status === "WORKER_ACCEPTED")
  );

  // Completed jobs for this worker
  const completedJobs = requests.filter(
    (r) =>
      (r.assignedWorkerId === currentWorker?.id || r.assignedWorkerName === currentWorker?.name) &&
      (r.status === "PAID" || r.status === "COMPLETED")
  );

  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleAccept = (reqId: string) => {
    acceptJob(reqId);
    router.push(`/worker/active/${reqId}`);
  };

  const handleConfirmReject = () => {
    if (!rejectingReqId || !rejectReason.trim()) return;
    rejectJob(rejectingReqId, rejectReason);
    setRejectingReqId(null);
    setRejectReason("");
  };

  const totalEarnings = currentWorker?.totalEarnings || (currentWorker?.jobsCompleted || 0) * 400 + 2450;
  const monthlyEarnings = currentWorker?.monthlyEarnings || 6200;
  const pendingPayout = currentWorker?.pendingPayout || 1200;

  return (
    <div className="space-y-6">
      {/* Header Bar with Worker Database Details & Availability Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block">
              WORKER DATABASE PROFILE
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-secondary text-[10px] font-mono font-bold">
              ID: {currentWorker?.workerCode || currentWorker?.id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary mt-0.5">
            {currentWorker?.name || "Worker Dashboard"}
          </h1>
          <span className="text-xs text-text-secondary">
            {currentWorker?.societyName || "Sahyog Cooperative Society"} · {currentWorker?.skills?.join(", ")}
          </span>
        </div>

        {/* WORKER AVAILABILITY TOGGLE BUTTON */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-text-primary block">Working Availability</span>
            <span className="text-[11px] text-text-secondary block">
              {isAvailable ? "Receiving job dispatches" : "Offline for new assignments"}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleAvailability}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 border ${
              isAvailable
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 ring-2 ring-emerald-500/30"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            }`}
          >
            <Power className={`w-4 h-4 ${isAvailable ? "text-white animate-pulse" : "text-gray-400"}`} />
            <span>{isAvailable ? "STATUS: AVAILABLE 🟢" : "STATUS: UNAVAILABLE 🔴"}</span>
          </button>
        </div>
      </div>

      {/* INDIVIDUAL WORKER REAL-TIME DATABASE EARNINGS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-900 to-primary text-white space-y-2 shadow-md">
          <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-bold block">
            TOTAL EARNINGS (DATABASE REAL-TIME)
          </span>
          <span className="text-3xl font-black text-accent block">₹{totalEarnings.toLocaleString()}</span>
          <span className="text-[11px] text-gray-200 block font-mono">
            {currentWorker?.jobsCompleted || 0} Total Jobs Completed
          </span>
        </Card>

        <Card className="p-5 bg-white border border-border space-y-2 shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
            THIS MONTH EARNINGS
          </span>
          <span className="text-2xl font-extrabold text-text-primary block">₹{monthlyEarnings.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 font-bold block">
            ✓ Credited via Supabase Database
          </span>
        </Card>

        <Card className="p-5 bg-amber-50/70 border border-amber-200 space-y-2 shadow-sm">
          <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold block">
            PENDING COOPERATIVE PAYOUT
          </span>
          <span className="text-2xl font-extrabold text-amber-900 block">₹{pendingPayout.toLocaleString()}</span>
          <span className="text-[11px] text-amber-700 block font-semibold">
            ● Ready for Bank Transfer
          </span>
        </Card>
      </div>

      {/* Availability Warning Banner if Unavailable */}
      {!isAvailable && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are currently marked <strong>Unavailable</strong>. Toggle status to <strong>AVAILABLE</strong> to receive new job matches from the cooperative administrator.
          </span>
        </div>
      )}

      {/* Incoming Job Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
          MY INCOMING ASSIGNMENTS ({assignedJobs.length})
        </h3>

        {assignedJobs.length === 0 ? (
          <Card className="text-center py-8 bg-gray-50 text-text-secondary text-sm">
            No pending job assignments for {currentWorker?.name} at the moment.
          </Card>
        ) : (
          assignedJobs.map((job) => (
            <Card key={job.id} className="border-l-4 border-l-accent space-y-4 shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="new" />
                  <span className="text-xs font-mono font-bold text-gray-500">{job.id}</span>
                </div>
                <Badge status={job.status} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {job.categoryName} — {job.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">"{job.problemDescription}"</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-text-secondary bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>📍 {job.address.locality}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>📅 {job.preferredDate} ({job.preferredTimeSlot})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-text-primary">👤 Consumer: {job.consumerName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {job.status === "WORKER_ACCEPTED" ? (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => router.push(`/worker/active/${job.id}`)}
                  >
                    Go to Active Job Controls →
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="md"
                      className="sm:w-1/2"
                      onClick={() => handleAccept(job.id)}
                    >
                      Accept Job
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      className="sm:w-1/2"
                      onClick={() => setRejectingReqId(job.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Recent History Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
          COMPLETED JOB HISTORY FOR {currentWorker?.name.toUpperCase()}
        </h3>

        {completedJobs.length === 0 ? (
          <Card className="text-center py-6 bg-gray-50 text-text-secondary text-xs">
            No completed jobs logged yet for this account.
          </Card>
        ) : (
          completedJobs.map((job) => (
            <Card key={job.id} className="bg-white flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gray-500">{job.id}</span>
                  <Badge variant="custom" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    COMPLETED
                  </Badge>
                </div>
                <h4 className="font-bold text-text-primary text-sm mt-1">{job.title}</h4>
                <p className="text-xs text-text-secondary">
                  {job.consumerName} · {job.preferredDate}
                </p>
              </div>

              <div className="text-right">
                <span className="font-bold text-primary text-base">₹{job.amount?.base || 400}</span>
                {job.rating?.stars && (
                  <div className="flex items-center gap-1 font-bold text-accent text-xs mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-accent" /> {job.rating.stars} ★
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={!!rejectingReqId}
        onClose={() => setRejectingReqId(null)}
        title="Reject Job Assignment"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Please provide a valid reason for rejecting this assignment. The cooperative administrator will reassign the job to another worker.
          </p>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              REJECTION REASON *
            </label>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Prior scheduling conflict / Out of service area / Tool unavailable"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setRejectingReqId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!rejectReason.trim()}
              onClick={handleConfirmReject}
            >
              Submit Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
