"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminWorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/admin/workers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workers
        </Link>
        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
          WORKERS / SURESH KUMAR
        </span>
        <h1 className="text-2xl font-extrabold text-text-primary mt-1">Worker Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Worker Identity & Certifications */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary text-white font-black text-2xl flex items-center justify-center shadow">
              SK
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-text-primary">Suresh Kumar</h2>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-success bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● ✓ Verified
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-mono font-bold text-gray-400 uppercase block text-[10px]">
                PRIMARY SKILL
              </span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">
                Plumbing
              </span>
            </div>

            <div>
              <span className="font-mono font-bold text-gray-400 uppercase block text-[10px]">
                EXPERIENCE
              </span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">
                6 years
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono font-bold text-gray-400 uppercase block text-[10px]">
              SERVICE AREAS
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-text-primary">
                Thane
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-text-primary">
                Kalwa
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-text-primary">
                Majiwada
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="font-mono font-bold text-gray-400 uppercase block text-[10px]">
              CERTIFICATIONS
            </span>
            <div className="space-y-2 text-xs font-semibold text-text-primary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>Plumbing certification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span>Safety training</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <span className="font-mono font-bold text-gray-400 uppercase block text-[10px] mb-2">
              STATUS
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-success border border-emerald-200">
              ● Available now
            </span>
          </div>
        </Card>

        {/* Right 2 Cols: Stats, Workload & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3 KPI Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5">
              <span className="text-2xl sm:text-3xl font-black text-text-primary block flex items-center gap-1">
                4.6 <Star className="w-5 h-5 fill-accent text-accent" />
              </span>
              <span className="text-xs font-semibold text-text-secondary">Rating</span>
            </Card>

            <Card className="p-5">
              <span className="text-2xl sm:text-3xl font-black text-text-primary block">
                142
              </span>
              <span className="text-xs font-semibold text-text-secondary">Completed jobs</span>
            </Card>

            <Card className="p-5">
              <span className="text-2xl sm:text-3xl font-black text-text-primary block">
                3
              </span>
              <span className="text-xs font-semibold text-text-secondary">Jobs this month</span>
            </Card>
          </div>

          {/* Recent Workload Card */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-text-primary text-base border-b border-border pb-2">
              Recent Workload
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-primary">This week</span>
                  <span className="font-mono text-text-primary font-bold">3 jobs</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-secondary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-primary">This month</span>
                  <span className="font-mono text-text-primary font-bold">3 jobs</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-secondary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary pt-2">
              Fairness index keeps assignments balanced across available workers with the same skill.
            </p>
          </Card>

          {/* Work History Card */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-text-primary text-base border-b border-border pb-2">
              Work history
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              142 completed jobs since joining in 2020, across plumbing repairs, installations and inspections.
            </p>

            <Button variant="outline" size="md" fullWidth>
              View Work History
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
