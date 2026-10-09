"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store/use-app-store";
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Flower2,
  Car,
  Tv,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Flower2,
  Car,
  Tv,
};

export default function ConsumerDashboard() {
  const router = useRouter();
  const { categories } = useAppStore();

  const howItWorks = [
    {
      step: "01",
      title: "Submit Request",
      desc: "Describe your service need, preferred date, and location",
    },
    {
      step: "02",
      title: "Admin Reviews",
      desc: "Cooperative admin filters and manually assigns a verified worker",
    },
    {
      step: "03",
      title: "Worker Arrives",
      desc: "Assigned worker accepts, schedules, and performs the service",
    },
    {
      step: "04",
      title: "Pay & Rate",
      desc: "Confirm completion, pay digitally, and rate the worker",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-primary text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span>SAHYOG — सहयोग MARKETPLACE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Verified Cooperative Workers, On Demand
          </h1>

          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            Connect with skilled workers from registered Labour Cooperative Societies — verified, accountable, and managed by cooperative administrators.
          </p>

          <div className="pt-2">
            <Link href="/consumer/browse">
              <Button variant="accent" size="lg" className="shadow-md">
                Request a Service <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* How It Works Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            HOW IT WORKS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map((item) => (
            <Card key={item.step} className="relative hover:shadow-md transition-shadow">
              <span className="text-2xl font-black text-accent block mb-2">{item.step}</span>
              <h4 className="font-bold text-text-primary text-base mb-1">{item.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            SERVICE CATEGORIES
          </h3>
          <Link
            href="/consumer/browse"
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Wrench;
            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/consumer/new-request?category=${cat.id}`)}
                className="bg-white border border-border rounded-xl p-5 hover:border-primary hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-secondary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors text-base">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-gray-500 font-medium block mt-0.5">
                    {cat.hindiName}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">₹{cat.basePrice} base</span>
                  <span className="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                    Book →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
