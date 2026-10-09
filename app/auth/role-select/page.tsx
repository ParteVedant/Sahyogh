"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import {
  User,
  UserCheck,
  HardHat,
  ShieldCheck,
  Award,
  Users,
  Lock,
} from "lucide-react";

export default function RoleSelectPage() {
  const router = useRouter();

  const handleNavigateRole = (roleParam: string) => {
    router.push(`/auth/login?role=${roleParam}`);
  };

  return (
    <div className="min-h-[85vh] bg-background py-12 px-4 sm:px-6 lg:px-8 space-y-12 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Welcome to Sahyog!
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-medium">
          Please select how you want to continue
        </p>
      </div>

      {/* 3 Role Selection Cards Grid (Customer, Coordinator, Worker) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Card 1: Customer (Green) */}
        <Card className="p-8 text-center space-y-8 flex flex-col justify-between hover:shadow-xl transition-all border-emerald-100 hover:border-emerald-500 group">
          <div className="space-y-5">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
              <User className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-text-primary">Customer</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                Book services for your home, household, or organization needs.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigateRole("customer")}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Continue as Customer
          </button>
        </Card>

        {/* Card 2: Coordinator (Purple) */}
        <Card className="p-8 text-center space-y-8 flex flex-col justify-between hover:shadow-xl transition-all border-purple-100 hover:border-purple-600 group">
          <div className="space-y-5">
            <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
              <UserCheck className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-text-primary">Coordinator</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                Manage requests, workers and service operations.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigateRole("coordinator")}
            className="w-full py-3.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Continue as Coordinator
          </button>
        </Card>

        {/* Card 3: Worker (Orange) */}
        <Card className="p-8 text-center space-y-8 flex flex-col justify-between hover:shadow-xl transition-all border-amber-100 hover:border-accent group">
          <div className="space-y-5">
            <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
              <HardHat className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-text-primary">Worker</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                View jobs, update status and manage work.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigateRole("worker")}
            className="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Continue as Worker
          </button>
        </Card>
      </div>

      {/* Bottom Value Proposition Bar */}
      <Card className="p-6 bg-white border border-border shadow-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-text-primary block">One Platform</span>
              <span className="text-[11px] text-text-secondary">Many Roles</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-secondary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-text-primary block">Trusted by</span>
              <span className="text-[11px] text-text-secondary">Cooperatives</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-text-primary block">Empowering Local</span>
              <span className="text-[11px] text-text-secondary">Communities</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-text-primary block">Secure &</span>
              <span className="text-[11px] text-text-secondary">Transparent</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
