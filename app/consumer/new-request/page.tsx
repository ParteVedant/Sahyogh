"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoDocumentUpload, PhotoDocument } from "@/components/ui/photo-document-upload";
import { ArrowLeft, Calendar, Clock, MapPin, AlertTriangle, ShieldAlert, Zap } from "lucide-react";

function NewRequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catIdParam = searchParams.get("category") || "plumbing";

  const { categories, createRequest } = useAppStore();
  const category = categories.find((c) => c.id === catIdParam) || categories[0];

  const [title, setTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [urgency, setUrgency] = useState<"NORMAL" | "HIGH" | "EMERGENCY">("NORMAL");
  const [preferredDate, setPreferredDate] = useState("2026-08-30");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("Morning (8am – 12pm)");
  const [houseNo, setHouseNo] = useState("Flat 302, Royal Palms");
  const [locality, setLocality] = useState("Borivali East");
  const [city, setCity] = useState("Mumbai");
  const [pinCode, setPinCode] = useState("400066");
  const [photoDoc, setPhotoDoc] = useState<PhotoDocument | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !problemDescription) return;

    const newReqId = createRequest({
      categoryId: category.id,
      categoryName: category.name,
      title,
      problemDescription,
      preferredDate,
      preferredTimeSlot,
      urgent: urgency === "EMERGENCY" || urgency === "HIGH",
      urgency: urgency,
      address: {
        houseNo,
        locality,
        city,
        pinCode,
      },
      evidencePhotos: photoDoc ? [photoDoc.fileDataUrl] : [],
    });

    router.push(`/consumer/track/${newReqId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/consumer/browse"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Category Selection
        </Link>
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
          STEP 2 OF 3
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Submit Requirement Details</h1>
        <p className="text-sm text-text-secondary mt-1">
          Provide your service requirement, set service urgency priority, and upload photo evidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Category Box */}
        <Card className="bg-blue-50/50 border-secondary/30 flex items-center justify-between p-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-secondary uppercase block">
              SELECTED SERVICE CATEGORY
            </span>
            <h3 className="text-lg font-bold text-text-primary mt-0.5">{category.name}</h3>
            <span className="text-xs text-text-secondary">{category.hindiName}</span>
          </div>

          <Link href="/consumer/browse">
            <Button variant="outline" size="sm">
              Change
            </Button>
          </Link>
        </Card>

        {/* Problem Title & Description */}
        <Card className="space-y-4 bg-white">
          <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            1. REQUIREMENT DETAILS &amp; SERVICE URGENCY
          </h3>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              SERVICE TITLE / PROBLEM SUMMARY *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Main circuit breaker trips when AC is turned on"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              DETAILED DESCRIPTION *
            </label>
            <textarea
              rows={4}
              required
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe the issue in detail — what happened, where is it located, any specific instructions..."
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* SERVICE URGENCY BUTTON SELECTOR */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              PRIORITIZE SERVICE URGENCY *
            </label>
            <p className="text-xs text-text-secondary">
              Select how urgently you require this service dispatch:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Normal Urgency Button */}
              <button
                type="button"
                onClick={() => setUrgency("NORMAL")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  urgency === "NORMAL"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30"
                    : "border-border bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    🟢 Normal Service
                  </span>
                  <input type="radio" name="urgency" checked={urgency === "NORMAL"} readOnly />
                </div>
                <span className="text-[11px] text-gray-500 block leading-tight">
                  Standard scheduling during preferred time slot
                </span>
              </button>

              {/* High Priority Urgency Button */}
              <button
                type="button"
                onClick={() => setUrgency("HIGH")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  urgency === "HIGH"
                    ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30"
                    : "border-border bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-800">
                    🟡 Priority Dispatch
                  </span>
                  <input type="radio" name="urgency" checked={urgency === "HIGH"} readOnly />
                </div>
                <span className="text-[11px] text-amber-700 block leading-tight">
                  Fast-track assignment within 4-6 hours
                </span>
              </button>

              {/* Emergency Urgency Button */}
              <button
                type="button"
                onClick={() => setUrgency("EMERGENCY")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  urgency === "EMERGENCY"
                    ? "border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/30"
                    : "border-border bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold flex items-center gap-1.5 text-red-700">
                    🔴 Emergency / Urgent
                  </span>
                  <input type="radio" name="urgency" checked={urgency === "EMERGENCY"} readOnly />
                </div>
                <span className="text-[11px] text-red-600 block leading-tight font-semibold">
                  Immediate 1-2 hour emergency worker dispatch
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Photo Upload Zone with Dropdown */}
          <PhotoDocumentUpload
            label="BEFORE WORK PHOTO / ISSUE DOCUMENT EVIDENCE (OPTIONAL)"
            documentTypes={[
              "Issue / Damage Site Photo (Before Work)",
              "Appliance Model / Tag Photo",
              "Existing Pipeline / Wiring Photo",
              "Other Reference Document",
            ]}
            value={photoDoc}
            onChange={setPhotoDoc}
          />
        </Card>

        {/* Schedule & Address */}
        <Card className="space-y-4 bg-white">
          <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            2. SCHEDULE PREFERENCE &amp; LOCATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                PREFERRED DATE *
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                TIME SLOT *
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white"
              >
                <option>Morning (8am – 12pm)</option>
                <option>Afternoon (12pm – 4pm)</option>
                <option>Evening (4pm – 8pm)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                FLAT / HOUSE NO / BUILDING *
              </label>
              <input
                type="text"
                required
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="Flat 302, Royal Palms"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  LOCALITY / AREA *
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Borivali East"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  CITY *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  PIN CODE *
                </label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="400066"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit CTA */}
        <div className="pt-2">
          <Button variant="accent" size="lg" fullWidth type="submit" className="shadow-md">
            Submit Service Request →
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-secondary">Loading form...</div>}>
      <NewRequestFormContent />
    </Suspense>
  );
}
