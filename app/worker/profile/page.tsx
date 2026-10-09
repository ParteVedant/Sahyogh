"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import {
  HardHat,
  Mail,
  Phone,
  Wrench,
  Award,
  MapPin,
  Building2,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Edit3,
  ArrowLeft,
  Power,
} from "lucide-react";

export default function WorkerProfilePage() {
  const { workers, currentUser, updateWorker } = useAppStore();

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

  const [isEditing, setIsEditing] = useState(false);
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

  const profile = {
    fullName: currentWorker?.name || "Worker",
    email: currentUser?.email || `${currentWorker?.name.toLowerCase().replace(/\s+/g, ".")}@sahyog.com`,
    phone: currentWorker?.phone || "+91 98201 45231",
    primarySkills: currentWorker?.skills?.join(", ") || "Plumbing, Maintenance",
    experience: "5 Years",
    serviceArea: currentWorker?.serviceAreas?.join(", ") || "Thane, Mumbai",
    societyName: currentWorker?.societyName || "Sahyog Cooperative Society",
    workerId: currentWorker?.workerCode || "WRK-001",
    verificationStatus: "Verified",
    memberSince: "Dec 2023",
    skills: currentWorker?.skills || ["Plumbing", "Tap Fitting", "Leakage Repair"],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/worker/jobs" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Jobs Queue
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-500">Worker Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            My Profile — {profile.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Manage your worker profile, working availability, and registered skills
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* AVAILABILITY TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-2 border ${
              isAvailable
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${isAvailable ? "text-white animate-pulse" : "text-gray-400"}`} />
            <span>{isAvailable ? "AVAILABLE 🟢" : "UNAVAILABLE 🔴"}</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-amber-600 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Avatar Card */}
        <Card className="p-6 text-center space-y-4 border border-amber-100 bg-white shadow-md rounded-2xl flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-amber-100 text-amber-800 font-extrabold text-3xl flex items-center justify-center border-4 border-accent shadow-inner">
              {profile.fullName.charAt(0)}
            </div>
            <span
              className={`w-5 h-5 rounded-full border-2 border-white absolute bottom-1 right-1 ${
                isAvailable ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-text-primary">{profile.fullName}</h2>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Verified Worker
            </div>
          </div>

          <div className="w-full space-y-2 pt-2 border-t border-gray-100 text-xs text-text-secondary text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Member since {profile.memberSince}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Professional Information Card */}
        <Card className="lg:col-span-2 p-6 space-y-6 border border-border bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-base text-text-primary">Professional Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-700" /> Primary Skills
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.primarySkills}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" /> Experience
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.experience}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-700" /> Service Area
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.serviceArea}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-700" /> Cooperative
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.societyName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-700" /> Worker ID
              </span>
              <p className="font-bold text-text-primary text-sm font-mono">{profile.workerId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Power className="w-3.5 h-3.5 text-amber-700" /> Current Availability
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  isAvailable
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isAvailable ? "Available 🟢" : "Unavailable 🔴"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills & Expertise Bar Card */}
      <Card className="p-6 space-y-4 border border-border bg-white shadow-md rounded-2xl">
        <h3 className="font-bold text-base text-text-primary border-b border-gray-100 pb-3">
          Skills &amp; Expertise
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-sm hover:bg-amber-100 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
