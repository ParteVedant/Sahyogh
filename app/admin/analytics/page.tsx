"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
          ANALYTICS & INSIGHTS
        </span>
        <h1 className="text-2xl font-extrabold text-text-primary mt-1 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Cooperative Performance Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-mono font-bold text-gray-500 uppercase block">
            AVERAGE MATCH SCORE
          </span>
          <span className="text-3xl font-black text-accent mt-1 block">88.4%</span>
          <span className="text-xs text-text-secondary mt-1 block">
            +3.2% optimization this month
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-mono font-bold text-gray-500 uppercase block">
            AVG. RESPONSE TIME
          </span>
          <span className="text-3xl font-black text-secondary mt-1 block">11 mins</span>
          <span className="text-xs text-text-secondary mt-1 block">
            Request to worker assignment
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-mono font-bold text-gray-500 uppercase block">
            SATISFACTION RATING
          </span>
          <span className="text-3xl font-black text-success mt-1 block">4.82 ★</span>
          <span className="text-xs text-text-secondary mt-1 block">
            Based on 142 completed consumer reviews
          </span>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-text-primary text-base border-b border-border pb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Demand & Workforce Distribution
        </h3>

        <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-2">
          <BarChart3 className="w-10 h-10 text-primary mx-auto opacity-70" />
          <h4 className="font-bold text-text-primary text-sm">
            Interactive Analytics Engine Active
          </h4>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Tracks real-time service demand, worker allocation balance, and cooperative society performance across Thane & Suburban Mumbai.
          </p>
        </div>
      </Card>
    </div>
  );
}
