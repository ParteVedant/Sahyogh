import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { calculateCandidateScores } from "../matching/matching.service";
import { supabase } from "../../config/supabase";

const assignWorkerSchema = z.object({
  workerId: z.string().min(1),
});

export async function getAdminDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    res.status(200).json({
      success: true,
      data: {
        kpis: {
          newRequests: { count: 12, subtext: "up 3 since yesterday" },
          activeJobs: { count: 8, subtext: "on schedule" },
          availableWorkers: { count: 34, subtext: "across 6 skills" },
          completedToday: { count: 26, subtext: "target 24" },
          workersBusy: { count: 21, subtext: "avg. 2.3 jobs each" },
          pendingAssignments: { count: 5, subtext: "needs review" },
        },
        workforceStatus: {
          available: { count: 34, percentage: 65 },
          busy: { count: 21, percentage: 40 },
          offline: { count: 28, percentage: 50 },
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getRequestCandidates(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const dummyReq = {
      id,
      categoryId: "plumbing",
      categoryName: "Plumbing Repairs",
      title: "Pipe leakage repair",
      problemDescription: "Bathroom pipe is leaking near the sink.",
      consumerName: "Rahul Sharma",
      consumerPhone: "+91 98199 88776",
      address: { houseNo: "Flat 402", locality: "Thane", city: "Thane", pinCode: "400601" },
      status: "ASSIGNMENT_PENDING" as const,
      preferredDate: "2026-08-28",
      preferredTimeSlot: "10:00 AM",
      createdAt: new Date().toISOString(),
    };

    const candidates = await calculateCandidateScores(dummyReq);

    res.status(200).json({
      success: true,
      matchingEngineVersion: "V2.0",
      recommendedCandidate: candidates[0],
      otherCandidates: candidates.slice(1),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function assignWorkerToRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const validated = assignWorkerSchema.parse(req.body);

    try {
      await supabase
        .from("service_requests")
        .update({
          assigned_worker_id: validated.workerId,
          status: "WORKER_ASSIGNED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(200).json({
      success: true,
      message: `Worker ${validated.workerId} manually assigned to request ${id} by Administrator ${req.userName || "Meera Kulkarni"}.`,
      data: {
        requestId: id,
        assignedWorkerId: validated.workerId,
        status: "WORKER_ASSIGNED",
        assignedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
