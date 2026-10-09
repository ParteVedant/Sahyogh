"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Home,
  CheckCircle2,
  Edit3,
  Calendar,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function CustomerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Neeraj Sharma",
    email: "neeraj.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Thane, Maharashtra",
    language: "English",
    notifications: "Email and SMS",
    memberSince: "May 2024",
    address: "12B, Green Park Society, Pokhran Road, Thane West, Maharashtra - 400606",
    emergencyContact: "Rita Sharma (Sister)",
    emergencyPhone: "+91 91234 56789",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/consumer/dashboard" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-500">My Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Manage your personal information and preferences
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Main Grid Section matching Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar Profile Summary Card */}
        <Card className="p-6 text-center space-y-4 border border-emerald-100 bg-white shadow-md rounded-2xl flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-3xl flex items-center justify-center border-4 border-emerald-500 shadow-inner">
              NS
            </div>
            <span className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-1 right-1" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-text-primary">{profile.fullName}</h2>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Customer
            </div>
          </div>

          <div className="w-full space-y-2 pt-2 border-t border-gray-100 text-xs text-text-secondary text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Member since {profile.memberSince}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Personal Information Card */}
        <Card className="lg:col-span-2 p-6 space-y-6 border border-border bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-base text-text-primary">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" /> Full Name
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.fullName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" /> Email Address
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" /> Phone Number
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Location / Area
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.location}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-700" /> Preferred Language
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.language}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-700" /> Notification Preference
              </span>
              <p className="font-bold text-text-primary text-sm">{profile.notifications}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Saved Address & Emergency Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Card */}
        <Card className="p-6 space-y-4 border border-border bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-text-primary">Address</h3>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Home</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="flex items-start gap-3 text-xs text-text-secondary">
            <Home className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium text-text-primary">{profile.address}</p>
          </div>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="p-6 space-y-4 border border-border bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-text-primary">Emergency Contact</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>{profile.emergencyContact}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-text-secondary">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{profile.emergencyPhone}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
