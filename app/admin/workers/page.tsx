"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, ArrowRight } from "lucide-react";

export default function AdminWorkersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const sampleWorkersList = [
    {
      id: "worker-2",
      name: "Amit Sharma",
      initials: "AS",
      skill: "Plumbing",
      status: "Available",
      jobs: 18,
      rating: 4.8,
    },
    {
      id: "worker-1",
      name: "Suresh Kumar",
      initials: "SK",
      skill: "Plumbing",
      status: "Available",
      jobs: 3,
      rating: 4.6,
    },
    {
      id: "worker-3",
      name: "Ramesh Patil",
      initials: "RP",
      skill: "Electrical",
      status: "Busy",
      jobs: 12,
      rating: 4.7,
    },
    {
      id: "worker-4",
      name: "Vijay Kumar",
      initials: "VK",
      skill: "Painting",
      status: "Available",
      jobs: 6,
      rating: 4.5,
    },
    {
      id: "worker-5",
      name: "Karan Singh",
      initials: "KS",
      skill: "Cleaning",
      status: "Offline",
      jobs: 4,
      rating: 4.4,
    },
    {
      id: "worker-6",
      name: "Deepak Rao",
      initials: "DR",
      skill: "Carpentry",
      status: "Available",
      jobs: 9,
      rating: 4.5,
    },
    {
      id: "worker-7",
      name: "Farhan Ali",
      initials: "FA",
      skill: "Electrical",
      status: "Offline",
      jobs: 7,
      rating: 4.3,
    },
  ];

  // Dynamic real-time filter logic
  const filteredWorkers = sampleWorkersList.filter((w) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchSkill = w.skill.toLowerCase().includes(q);
      if (!matchName && !matchSkill) return false;
    }

    if (selectedSkill !== "ALL") {
      if (w.skill.toLowerCase() !== selectedSkill.toLowerCase()) return false;
    }

    if (selectedStatus !== "ALL") {
      if (w.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Worker CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-text-secondary uppercase tracking-widest block">
            WORKERS
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary mt-1">Workers</h1>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => router.push("/admin/workers/new")}
          className="shadow-md"
        >
          <Plus className="w-4 h-4 ml-1" /> Add Worker
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workers by name or skill..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-xs bg-white focus:ring-2 focus:ring-primary focus:outline-none font-semibold"
          />
        </div>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full sm:w-40 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold bg-white focus:outline-none"
        >
          <option value="ALL">All Skills</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Painting">Painting</option>
          <option value="Carpentry">Carpentry</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-40 px-3 py-2.5 rounded-xl border border-border text-xs font-semibold bg-white focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>
      </Card>

      {/* Workers Directory Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="p-4 pl-6">WORKER</th>
                <th className="p-4">SKILL</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">JOBS</th>
                <th className="p-4 text-center">RATING</th>
                <th className="p-4 pr-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No workers match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {w.initials}
                        </div>
                        <div>
                          <span className="font-bold text-text-primary text-sm block">
                            {w.name}
                          </span>
                          <Badge variant="verified" />
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-text-primary">{w.skill}</td>

                    <td className="p-4">
                      {w.status === "Available" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-success border border-emerald-200">
                          ● Available
                        </span>
                      ) : w.status === "Busy" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-secondary border border-blue-200">
                          ● Busy
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                          ● Offline
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-text-primary">
                      {w.jobs}
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-accent font-mono">
                        <Star className="w-3.5 h-3.5 fill-accent" /> {w.rating}
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => router.push(`/admin/workers/${w.id}`)}
                        className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        View profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
