"use client";

import React, { useState } from "react";
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
  ArrowLeft,
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

export default function BrowseServices() {
  const router = useRouter();
  const { categories } = useAppStore();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedCatId) {
      router.push(`/consumer/new-request?category=${selectedCatId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator & Header */}
      <div>
        <Link
          href="/consumer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <span className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
          STEP 1 OF 3
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Select a Service</h1>
        <p className="text-sm text-text-secondary mt-1">
          Choose the service category you need assistance with today.
        </p>
      </div>

      {/* 2-Column Selectable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Wrench;
          const isSelected = selectedCatId === cat.id;

          return (
            <Card
              key={cat.id}
              selected={isSelected}
              onClick={() => setSelectedCatId(cat.id)}
              className="cursor-pointer hover:border-primary transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-text-primary">{cat.name}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {cat.description}
                </p>

                {/* Sub-services listed in accent orange */}
                <p className="text-xs font-semibold text-accent mt-3">
                  {cat.subServices.join(" · ")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">Standard Cooperative Rate</span>
                <span className="font-bold text-primary">₹{cat.basePrice} base rate</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Continue Action */}
      <div className="pt-4 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedCatId}
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue with Service <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
