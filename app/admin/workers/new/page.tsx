"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoDocumentUpload, PhotoDocument } from "@/components/ui/photo-document-upload";
import { ArrowLeft, Plus } from "lucide-react";

export default function AdminAddWorkerPage() {
  const router = useRouter();
  const { addWorker } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [primarySkill, setPrimarySkill] = useState("Plumbing");
  const [experienceYears, setExperienceYears] = useState("3 years");
  const [subSkills, setSubSkills] = useState(["Pipe repair", "Fittings", "Maintenance"]);
  const [serviceAreas, setServiceAreas] = useState(["Thane", "Kalwa"]);
  const [availability, setAvailability] = useState("AVAILABLE");
  const [photoDoc, setPhotoDoc] = useState<PhotoDocument | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobileNumber) return;

    addWorker({
      name: fullName,
      workerCode: `WRK-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: mobileNumber,
      skills: [primarySkill, ...subSkills],
      rating: 5.0,
      jobsCompleted: 0,
      societyName: "Sahyog Federation",
      serviceAreas: serviceAreas,
      status: availability as any,
      availableNow: availability === "AVAILABLE",
    });

    router.push("/admin/workers");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/workers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workers
        </Link>
        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
          WORKERS / REGISTER NEW
        </span>
        <h1 className="text-2xl font-extrabold text-text-primary mt-1">
          Add Cooperative Worker
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Register a new worker profile and upload identity &amp; skill qualification document photos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Suresh Kumar"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                MOBILE NUMBER *
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 9XXXX XXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                PRIMARY SKILL *
              </label>
              <select
                value={primarySkill}
                onChange={(e) => setPrimarySkill(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                YEARS OF EXPERIENCE *
              </label>
              <input
                type="text"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 5 years"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Sub-skills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              SUB-SKILLS &amp; SPECIALIZATIONS
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {subSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* PHOTO DOCUMENT UPLOAD WITH DROPDOWN */}
          <PhotoDocumentUpload
            label="WORKER IDENTITY & CERTIFICATION PHOTO DOCUMENT"
            documentTypes={[
              "Aadhaar Card (Photo ID)",
              "PAN Card",
              "Skill Certificate / Trade License",
              "Police Verification Certificate",
              "Driving License",
            ]}
            value={photoDoc}
            onChange={setPhotoDoc}
          />

          {/* Availability */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              INITIAL AVAILABILITY STATUS
            </label>

            <div className="flex items-center gap-6 text-xs font-semibold text-text-primary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === "AVAILABLE"}
                  onChange={() => setAvailability("AVAILABLE")}
                />
                <span>Available for assignment</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === "UNAVAILABLE"}
                  onChange={() => setAvailability("UNAVAILABLE")}
                />
                <span>Not yet available</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => router.push("/admin/workers")}
            >
              Cancel
            </Button>
            <Button variant="accent" size="md" type="submit">
              Register Worker →
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
