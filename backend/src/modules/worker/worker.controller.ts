import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabase } from "../../config/supabase";

const rejectJobSchema = z.object({
  reason: z.string().min(3, "Rejection reason is required"),
});

const completeJobSchema = z.object({
  notes: z.string().min(5, "Completion notes are required"),
  photos: z.array(z.string()).optional(),
});

export async function getWorkerJobs(req: AuthenticatedRequest, res: Response) {
  try {
    const workerId = req.userId || "worker-1";

    res.status(200).json({
      success: true,
      workerId,
      assignedJobs: [
        {
          id: "REQ-1042",
          categoryId: "plumbing",
          categoryName: "Plumbing Repairs",
          title: "Pipe leakage repair",
          problemDescription: "Bathroom pipe is leaking near the sink.",
          consumerName: "Rahul Sharma",
          consumerPhone: "+91 98199 88776",
          address: { houseNo: "Flat 402, Building A", locality: "Thane", city: "Thane", pinCode: "400601" },
          status: "WORKER_ASSIGNED",
          preferredDate: "2026-08-28",
          preferredTimeSlot: "10:00 AM",
        },
      ],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function acceptWorkerJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    try {
      await supabase
        .from("service_requests")
        .update({ status: "WORKER_ACCEPTED", updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(200).json({
      success: true,
      message: `Job ${id} accepted by worker.`,
      status: "WORKER_ACCEPTED",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function rejectWorkerJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const validated = rejectJobSchema.parse(req.body);

    try {
      await supabase
        .from("service_requests")
        .update({
          status: "REJECTED",
          assigned_worker_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(200).json({
      success: true,
      message: `Job ${id} rejected. Reason: '${validated.reason}'. Request returned to Admin queue for reassignment.`,
      status: "REJECTED",
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export async function startWorkerJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    try {
      await supabase
        .from("service_requests")
        .update({ status: "IN_PROGRESS", updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(200).json({
      success: true,
      message: `Service execution started for job ${id}.`,
      status: "IN_PROGRESS",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function completeWorkerJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const validated = completeJobSchema.parse(req.body);

    try {
      await supabase
        .from("service_requests")
        .update({
          status: "COMPLETION_PENDING",
          completion_notes: validated.notes,
          evidence_photos: validated.photos || [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(200).json({
      success: true,
      message: `Job ${id} marked complete by worker. Awaiting consumer payment & confirmation.`,
      status: "COMPLETION_PENDING",
      completionNotes: validated.notes,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export async function getWorkerEarnings(req: AuthenticatedRequest, res: Response) {
  try {
    res.status(200).json({
      success: true,
      totalEarnings: 1550,
      completedJobsCount: 4,
      cooperativeAccountStatus: "VERIFIED",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
