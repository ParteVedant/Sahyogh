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
  Star,
  MapPin,
  AlertCircle,
  Building,
} from "lucide-react";

export default function AssignWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { requests, workers, assignWorker } = useAppStore();

  const request = requests.find((r) => r.id === resolvedParams.id) || requests[0];

  // 4 Filter toggles
  const [filterVerified, setFilterVerified] = useState(true);
  const [filterAvailable, setFilterAvailable] = useState(true);
  const [filterSkillMatch, setFilterSkillMatch] = useState(true);
  const [filterAreaMatch, setFilterAreaMatch] = useState(true);

  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(
    request.assignedWorkerId || null
  );

  const filteredWorkers = workers.filter((w) => {
    if (filterAvailable && w.status === "BUSY" && !w.availableNow) return false;
    if (
      filterSkillMatch &&
      !w.skills.some(
        (s) =>
          s.toLowerCase().includes(request.categoryName.toLowerCase()) ||
          request.categoryName.toLowerCase().includes(s.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleAssign = () => {
    if (!selectedWorkerId) return;
    assignWorker(request.id, selectedWorkerId);
    router.push(`/admin/assign/${request.id}/success`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incoming Requests
        </Link>
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
          COOPERATIVE WORKFORCE ALLOCATION
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Assign Worker</h1>
      </div>

      {/* Request Summary Card (Light Teal/Green-tinted) */}
      <Card className="bg-emerald-50/40 border-emerald-200 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            {request.id}
          </span>
          <Badge variant="custom" className="bg-emerald-100 text-emerald-800 border-emerald-300">
            {request.categoryName}
          </Badge>
          <Badge variant="custom" className="bg-emerald-100 text-emerald-800 border-emerald-300">
            {request.address.locality}
          </Badge>
          {request.urgent && <Badge variant="urgent" />}
        </div>

        <div>
          <h3 className="text-lg font-bold text-text-primary">{request.title}</h3>
          <p className="text-xs text-text-secondary mt-1">"{request.problemDescription}"</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-2 border-t border-emerald-200/60">
          <span>
            👤 <strong>Consumer:</strong> {request.consumerName} ({request.consumerPhone})
          </span>
          <span>
            📅 <strong>Schedule:</strong> {request.preferredDate} ({request.preferredTimeSlot})
          </span>
          <span>
            📍 <strong>Address:</strong> {request.address.houseNo}, {request.address.locality}
          </span>
        </div>
      </Card>

      {/* Rejection Alert Banner if applicable */}
      {request.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">PREVIOUS WORKER REJECTED JOB</span>
            Reason submitted: "{request.rejectionReason}". Please select a replacement worker below.
          </div>
        </div>
      )}

      {/* FILTER WORKERS Checkbox Controls */}
      <Card className="space-y-3 bg-gray-50">
        <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
          FILTER WORKERS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-text-primary">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={(e) => setFilterVerified(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>☑ Verified Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>☑ Available</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterSkillMatch}
              onChange={(e) => setFilterSkillMatch(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>☑ Skill Match</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterAreaMatch}
              onChange={(e) => setFilterAreaMatch(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>☑ Area Match</span>
          </label>
        </div>
      </Card>

      {/* Candidate Worker List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
          ELIGIBLE WORKERS ({filteredWorkers.length} MATCHES)
        </h3>

        {filteredWorkers.length === 0 ? (
          <Card className="text-center py-8 bg-gray-50 text-text-secondary text-sm">
            No workers match all active filter criteria. Uncheck filters to widen search.
          </Card>
        ) : (
          filteredWorkers.map((w) => {
            const isSelected = selectedWorkerId === w.id;
            return (
              <Card
                key={w.id}
                selected={isSelected}
                onClick={() => setSelectedWorkerId(w.id)}
                className="cursor-pointer hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow">
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-text-primary text-base">{w.name}</h4>
                        <span className="text-xs font-mono font-bold text-gray-500">{w.workerCode}</span>
                        <Badge variant="verified" />
                      </div>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-gray-400" /> {w.societyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                    <span className="font-semibold text-text-secondary">Skills:</span>
                    {w.skills.map((s) => (
                      <span key={s} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-text-secondary">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Areas: {w.serviceAreas.join(", ")}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-bold text-accent text-sm">
                      <Star className="w-4 h-4 fill-accent" /> {w.rating} ★
                    </div>
                    <span className="text-xs text-text-secondary block">
                      {w.jobsCompleted} completed
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        w.isAvailable ? "bg-success" : "bg-danger"
                      }`}
                    />
                    <span className={w.isAvailable ? "text-success" : "text-danger"}>
                      {w.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Assign CTA Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedWorkerId}
          onClick={handleAssign}
          className="shadow-lg"
        >
          Assign Selected Worker →
        </Button>
      </div>
    </div>
  );
}
