"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Wrench, Zap, Sparkles, Paintbrush, Hammer, RefreshCw } from "lucide-react";

export default function AdminServiceRequestsPage() {
  const router = useRouter();
  const { requests, initSupabaseData } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh from Supabase when coordinator opens requests page
  useEffect(() => {
    setIsRefreshing(true);
    initSupabaseData().finally(() => setIsRefreshing(false));
  }, [initSupabaseData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    initSupabaseData().finally(() => setIsRefreshing(false));
  };

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");

  const filterTabs = [
    { label: "All", value: "ALL" },
    { label: "New", value: "NEW" },
    { label: "Matching", value: "MATCHING" },
    { label: "Awaiting Approval", value: "AWAITING" },
    { label: "Assigned", value: "ASSIGNED" },
  ];

  // Real-time filtering logic applying Search, Tab, Service, and Area filters simultaneously
  const filteredRequests = requests.filter((req) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchCategory = req.categoryName.toLowerCase().includes(q);
      const matchLocality = req.address.locality.toLowerCase().includes(q);
      const matchConsumer = req.consumerName.toLowerCase().includes(q);
      const matchId = req.id.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchLocality && !matchConsumer && !matchId) {
        return false;
      }
    }

    // 2. Status Tab Filter
    if (activeTab === "NEW") {
      if (req.status !== "REQUESTED" && req.status !== "UNDER_REVIEW") return false;
    } else if (activeTab === "MATCHING") {
      if (req.status !== "ASSIGNMENT_PENDING") return false;
    } else if (activeTab === "AWAITING") {
      if (req.status !== "WORKER_ASSIGNED") return false;
    } else if (activeTab === "ASSIGNED") {
      if (req.status !== "WORKER_ACCEPTED" && req.status !== "SCHEDULED" && req.status !== "IN_PROGRESS")
        return false;
    }

    // 3. Service Dropdown Filter
    if (selectedService !== "ALL") {
      if (req.categoryId.toLowerCase() !== selectedService.toLowerCase()) return false;
    }

    // 4. Area Dropdown Filter
    if (selectedArea !== "ALL") {
      if (!req.address.locality.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
            REQUESTS
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary mt-1">
            Service Requests
            {isRefreshing && (
              <span className="ml-3 text-xs font-normal text-text-secondary inline-flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading from database...
              </span>
            )}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-xs font-bold text-text-primary hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-white shadow-md"
                  : "bg-white border border-border text-text-secondary hover:text-text-primary hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Select Filters */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, area, customer or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-xs bg-white focus:ring-2 focus:ring-primary focus:outline-none font-semibold"
          />
        </div>

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold bg-white focus:outline-none"
        >
          <option value="ALL">All Services</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="cleaning">Cleaning</option>
          <option value="painting">Painting</option>
          <option value="carpentry">Carpentry</option>
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold bg-white focus:outline-none"
        >
          <option value="ALL">All Areas</option>
          <option value="Borivali">Borivali East</option>
          <option value="Kandivali">Kandivali West</option>
          <option value="Thane">Thane</option>
          <option value="Kalwa">Kalwa</option>
          <option value="Majiwada">Majiwada</option>
        </select>
      </Card>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 text-text-secondary text-sm">
            No service requests match the active filter criteria.
          </Card>
        ) : (
          filteredRequests.map((req) => {
            const Icon =
              req.categoryId === "electrical"
                ? Zap
                : req.categoryId === "cleaning"
                ? Sparkles
                : req.categoryId === "painting"
                ? Paintbrush
                : req.categoryId === "carpentry"
                ? Hammer
                : Wrench;

            const badgeText =
              req.status === "WORKER_ASSIGNED"
                ? "● Awaiting Assignment"
                : req.status === "REQUESTED" || req.status === "UNDER_REVIEW"
                ? "● New"
                : req.status === "ASSIGNMENT_PENDING"
                ? "● Matching"
                : "● Assigned";

            const badgeColor =
              badgeText === "● New"
                ? "bg-blue-100 text-secondary border-blue-200"
                : badgeText === "● Awaiting Assignment"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-emerald-100 text-success border-emerald-200";

            return (
              <Card
                key={req.id}
                className="p-5 hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-500">{req.id}</span>
                      <h4 className="font-bold text-text-primary text-base">{req.categoryName}</h4>
                    </div>
                    <p className="text-xs text-text-secondary">{req.title}</p>
                    <div className="flex items-center gap-3 text-xs text-text-secondary font-mono pt-1">
                      <span>📍 {req.address.locality}</span>
                      <span>• {req.preferredDate} ({req.preferredTimeSlot})</span>
                      <span>👤 {req.consumerName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
                    {badgeText}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/requests/${req.id}`)}
                  >
                    View Request
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
