"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, CheckCircle, Layers, User, Check, Sparkles } from "lucide-react";

export default function ConsumerRateQueuePage() {
  const router = useRouter();
  const { requests, workers, submitRating } = useAppStore();

  const completedJobs = requests.filter(
    (r) => r.status === "COMPLETED" || r.status === "PAID" || r.rating?.stars
  );

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    completedJobs[0]?.id || requests[0]?.id || ""
  );

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0];
  const assignedWorker = workers.find((w) => w.id === activeRequest?.assignedWorkerId);

  const [stars, setStars] = useState(activeRequest?.rating?.stars || 0);
  const [hoverStars, setHoverStars] = useState(0);
  const [review, setReview] = useState(activeRequest?.rating?.review || "");
  const [selectedIssues, setSelectedIssues] = useState<string[]>(activeRequest?.rating?.issues || []);
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);

  const issuesList = [
    "Late arrival",
    "Incomplete work",
    "Behaviour issue",
    "Overcharging",
  ];

  const handleSelectJob = (reqId: string) => {
    setSelectedRequestId(reqId);
    setJustSubmittedId(null);
    const target = requests.find((r) => r.id === reqId);
    setStars(target?.rating?.stars || 0);
    setReview(target?.rating?.review || "");
    setSelectedIssues(target?.rating?.issues || []);
  };

  const toggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter((i) => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = () => {
    if (!activeRequest || stars === 0) return;
    submitRating(activeRequest.id, stars, review, selectedIssues);
    setJustSubmittedId(activeRequest.id);
  };

  const pendingRatingsCount = completedJobs.filter((r) => !r.rating?.stars).length;

  if (!activeRequest) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-text-primary">No Completed Jobs to Rate</h2>
        <p className="text-xs text-text-secondary">
          Once a service request is completed by a worker, you can rate their performance here.
        </p>
        <Button variant="accent" onClick={() => router.push("/consumer/dashboard")}>
          Return to Dashboard
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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Consumer Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-mono text-text-secondary uppercase tracking-widest">
              WORKER RATINGS &amp; FEEDBACK CONSOLE
            </span>
            <h1 className="text-2xl font-extrabold text-text-primary mt-1">Rate Worker Service</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>{completedJobs.length} Completed Jobs in Queue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Completed Jobs Queue Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold tracking-wider text-text-secondary uppercase">
              1. CHOOSE WORKER / JOB TO RATE
            </h3>
            <span className="text-[11px] font-bold text-amber-800">
              {pendingRatingsCount} Pending
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {completedJobs.map((req) => {
              const isSelected = req.id === selectedRequestId;
              const isRated = !!req.rating?.stars;
              const worker = workers.find((w) => w.id === req.assignedWorkerId);
              const workerName = req.assignedWorkerName || worker?.name || "Assigned Worker";

              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectJob(req.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? "border-2 border-accent shadow-md bg-amber-50/20 ring-2 ring-accent/20"
                      : "border-border hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-white rounded-full text-[10px] font-bold">
                      Selected
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {workerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono font-bold text-gray-500 block">
                        {req.id}
                      </span>
                      <h4 className="font-bold text-text-primary text-sm truncate">
                        {workerName}
                      </h4>
                      <span className="text-xs text-text-secondary block truncate">
                        {req.categoryName} — {req.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400 font-mono text-[11px]">
                      {req.preferredDate}
                    </span>

                    {isRated ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1">
                        ★ Rated {req.rating?.stars}.0
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold text-[10px] animate-pulse">
                        ● Pending Rating
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Rating Console for Selected Item */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-extrabold tracking-wider text-text-secondary uppercase">
            2. EVALUATE WORKER PERFORMANCE FOR #{activeRequest.id}
          </h3>

          {justSubmittedId === activeRequest.id || activeRequest.rating?.stars ? (
            <Card className="p-8 text-center space-y-4 border-success bg-emerald-50/50">
              <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Rating Submitted Successfully!</h2>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Thank you for submitting a <strong>{activeRequest.rating?.stars || stars} ★ rating</strong> for{" "}
                <strong>{activeRequest.assignedWorkerName || assignedWorker?.name || "Assigned Worker"}</strong>. Your feedback maintains quality across Labour Cooperative Societies.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                {completedJobs.some((r) => r.id !== activeRequest.id && !r.rating?.stars) && (
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => {
                      const nextUnrated = completedJobs.find((r) => r.id !== activeRequest.id && !r.rating?.stars);
                      if (nextUnrated) {
                        handleSelectJob(nextUnrated.id);
                      }
                    }}
                  >
                    Rate Next Pending Worker →
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={() => router.push("/consumer/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="space-y-6 py-6 px-6 bg-white">
              {/* Worker Profile Summary */}
              <div className="flex items-center gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                <div className="w-14 h-14 rounded-full bg-accent text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                  {activeRequest.assignedWorkerName ? activeRequest.assignedWorkerName.charAt(0) : "W"}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase block">
                    ASSIGNED WORKER
                  </span>
                  <h3 className="font-extrabold text-text-primary text-lg">
                    {activeRequest.assignedWorkerName || assignedWorker?.name || "Assigned Worker"}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {activeRequest.categoryName} · Service Request #{activeRequest.id}
                  </p>
                </div>
              </div>

              {/* 5-Star Interactive Selector */}
              <div className="space-y-2 text-center py-2 border-t border-b border-gray-100">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
                  TAP STARS TO RATE WORKER
                </label>

                <div className="flex items-center justify-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const active = starNum <= (hoverStars || stars);
                    return (
                      <button
                        key={starNum}
                        type="button"
                        onMouseEnter={() => setHoverStars(starNum)}
                        onMouseLeave={() => setHoverStars(0)}
                        onClick={() => setStars(starNum)}
                        className="p-1 focus:outline-none transition-transform transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            active
                              ? "text-accent fill-accent shadow-sm"
                              : "text-gray-300 fill-gray-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {stars > 0 && (
                  <span className="text-xs font-extrabold text-accent block">
                    {stars === 5 ? "⭐⭐⭐⭐⭐ Outstanding Performance!" : stars === 4 ? "⭐⭐⭐⭐ Very Good Service" : stars === 3 ? "⭐⭐⭐ Average Experience" : "⭐ Needs Improvement"}
                  </span>
                )}
              </div>

              {/* Written Review */}
              <div className="text-left space-y-1.5">
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
                  WRITTEN REVIEW (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write feedback — e.g. 'Worker arrived on time, completed pipe repair professionally, and cleaned the site.'"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* ANY ISSUES Checkbox Group */}
              <div className="text-left space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
                  ANY ISSUES FACED DURING SERVICE?
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {issuesList.map((issue) => {
                    const isChecked = selectedIssues.includes(issue);
                    return (
                      <button
                        type="button"
                        key={issue}
                        onClick={() => toggleIssue(issue)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? "border-danger bg-red-50 text-danger"
                            : "border-border text-text-secondary hover:bg-gray-50"
                        }`}
                      >
                        <span>{issue}</span>
                        {isChecked && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Rating Button */}
              <Button
                variant="accent"
                size="lg"
                fullWidth
                disabled={stars === 0}
                onClick={handleSubmit}
                className="shadow-md py-3.5 text-base"
              >
                Submit Worker Rating →
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
