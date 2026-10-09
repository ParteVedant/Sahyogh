import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabase } from "../../config/supabase";

const ratingSchema = z.object({
  requestId: z.string().min(1),
  stars: z.number().min(1).max(5),
  review: z.string().optional(),
  issues: z.array(z.string()).optional(),
});

export async function getInvoiceByRequestId(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const baseFare = 350;
    const fee = 50;
    const tax = Math.round((baseFare + fee) * 0.18);
    const total = baseFare + fee + tax;

    res.status(200).json({
      success: true,
      invoiceNumber: `INV-${id}-${Date.now().toString().slice(-4)}`,
      requestId: id,
      issuedTo: "Rahul Sharma",
      cooperativeIssuer: "Sahyog Labour Cooperative Federation",
      date: new Date().toISOString(),
      breakdown: {
        baseFare,
        serviceFee: fee,
        gst18Percent: tax,
        totalPayable: total,
      },
      paymentStatus: "PAID",
      paymentMethod: "UPI / Razorpay Sandbox",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function submitWorkerRating(req: AuthenticatedRequest, res: Response) {
  try {
    const validated = ratingSchema.parse(req.body);

    try {
      await supabase
        .from("service_requests")
        .update({
          status: "COMPLETED",
          rating: {
            stars: validated.stars,
            review: validated.review || "",
            issues: validated.issues || [],
            createdAt: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", validated.requestId);
    } catch (dbErr) {
      console.warn("Supabase update warning:", dbErr);
    }

    res.status(201).json({
      success: true,
      message: `Rating of ${validated.stars} stars submitted for request ${validated.requestId}.`,
      data: {
        requestId: validated.requestId,
        stars: validated.stars,
        review: validated.review,
        issues: validated.issues,
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
