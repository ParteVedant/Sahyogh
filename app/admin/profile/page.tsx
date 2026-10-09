"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  UserCheck,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  Users,
  Inbox,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

export default function CoordinatorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile] = useState({
    fullName: "Anita Deshmukh",
    email: "anita.deshmukh@sahyog.coop",
    phone: "+91 98256 56789",
    societyName: "Sahyog Cooperative Society",
    cooperativeId: "COOP-THN-001",
    location: "Thane, Maharashtra",
    role: "Service Coordinator",
    memberSince: "January 2024",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-500">Coordinator Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Manage your coordinator profile and cooperative details
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Main Grid matching Middle Wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Avatar Card */}
        <Card className="p-6 text-center space-y-4 border border-purple-100 bg-white shadow-md rounded-2xl flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-purple-100 text-purple-800 font-extrabold text-3xl flex items-center justify-center border-4 border-purple-600 shadow-inner">
              AD
            </div>
            <span className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white absolute bottom-1 right-1" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-text-primary">{profile.fullName}</h2>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mt-1">
              <UserCheck className="w-3.5 h-3.5" /> Coordinator
            </div>
          </div>

          <div className="w-full space-y-2 pt-2 border-t border-gray-100 text-xs text-text-secondary text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span>Joined Sahyog: {profile.memberSince}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Cooperative Information Card */}
        <Card className="lg:col-span-2 p-6 space-y-6 border border-border bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-base text-text-primary">Cooperative Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-700" /> Cooperative Name
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.societyName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-purple-700" /> Cooperative ID
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.cooperativeId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-700" /> Location
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.location}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-700" /> Your Role
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.role}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-700" /> Member Since
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.memberSince}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Permissions Grid Card */}
      <Card className="p-6 space-y-4 border border-border bg-white shadow-md rounded-2xl">
        <h3 className="font-bold text-base text-text-primary border-b border-gray-100 pb-3">
          Permissions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-purple-50">
            <Users className="w-5 h-5 text-purple-700" />
            <span className="font-bold text-text-primary">Assign Workers</span>
            <span className="text-xs font-extrabold text-purple-700">Yes</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-purple-50">
            <Inbox className="w-5 h-5 text-purple-700" />
            <span className="font-bold text-text-primary">Approve Requests</span>
            <span className="text-xs font-extrabold text-purple-700">Yes</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-purple-50">
            <UserCheck className="w-5 h-5 text-purple-700" />
            <span className="font-bold text-text-primary">Manage Workers</span>
            <span className="text-xs font-extrabold text-purple-700">Yes</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-purple-50">
            <BarChart3 className="w-5 h-5 text-purple-700" />
            <span className="font-bold text-text-primary">View Reports</span>
            <span className="text-xs font-extrabold text-purple-700">Yes</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
