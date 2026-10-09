import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabase } from "../../config/supabase";

const createComplaintSchema = z.object({
  requestId: z.string().min(1),
  category: z.enum(["LATE_ARRIVAL", "BEHAVIOR", "OVERCHARGING", "QUALITY_ISSUE", "OTHER"]),
  description: z.string().min(5),
  evidencePhotos: z.array(z.string()).optional(),
});

const resolveComplaintSchema = z.object({
  resolution: z.enum(["RESOLVED", "REJECTED"]),
  refundApproved: z.boolean(),
  refundAmount: z.number().optional(),
  adminNotes: z.string().min(3),
});

let inMemoryComplaints = [
  {
    id: "CMP-001",
    requestId: "1042",
    consumerName: "Rahul Sharma",
    category: "LATE_ARRIVAL",
    description: "Worker arrived 45 minutes past the agreed 10:00 AM slot.",
    status: "OPEN",
    targetSlaHours: 24,
    createdAt: new Date().toISOString(),
  },
];

/**
 * POST /api/v1/complaints
 * Consumer files a service complaint
 */
export async function createComplaint(req: AuthenticatedRequest, res: Response) {
  try {
    const validated = createComplaintSchema.parse(req.body);
    const complaintId = `CMP-${Math.floor(100 + Math.random() * 900)}`;

    const newComplaint = {
      id: complaintId,
      requestId: validated.requestId,
      consumerName: req.userName || "Consumer",
      category: validated.category,
      description: validated.description,
      evidencePhotos: validated.evidencePhotos || [],
      status: "OPEN",
      targetSlaHours: 24,
      createdAt: new Date().toISOString(),
    };

    inMemoryComplaints.unshift(newComplaint);

    res.status(201).json({
      success: true,
      message: "Complaint filed successfully. Cooperative Admin will investigate within 24 hours.",
      data: newComplaint,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

/**
 * GET /api/v1/complaints
 * Admin complaint investigation queue
 */
export async function getComplaintsQueue(req: AuthenticatedRequest, res: Response) {
  try {
    res.status(200).json({
      success: true,
      count: inMemoryComplaints.length,
      targetSlaHours: 24,
      data: inMemoryComplaints,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/v1/complaints/:id/resolve
 * Admin resolves complaint & approves manual refund
 */
export async function resolveComplaint(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const validated = resolveComplaintSchema.parse(req.body);

    const complaint = inMemoryComplaints.find((c) => c.id === id);
    if (complaint) {
      complaint.status = validated.resolution;
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${id} investigated and marked as ${validated.resolution}.`,
      refundApproved: validated.refundApproved,
      refundAmount: validated.refundApproved ? validated.refundAmount || 350 : 0,
      adminNotes: validated.adminNotes,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
