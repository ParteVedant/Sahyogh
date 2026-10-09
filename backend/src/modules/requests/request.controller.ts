import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabase } from "../../config/supabase";
import { ServiceRequest } from "../../types";

const createRequestSchema = z.object({
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  title: z.string().min(3),
  problemDescription: z.string().min(5),
  preferredDate: z.string(),
  preferredTimeSlot: z.string(),
  address: z.object({
    houseNo: z.string().min(1),
    locality: z.string().min(1),
    city: z.string().min(1),
    pinCode: z.string().min(1),
  }),
  evidencePhotos: z.array(z.string()).optional(),
  consumerName: z.string().optional(),
  consumerPhone: z.string().optional(),
});

let inMemoryRequests: ServiceRequest[] = [
  {
    id: "REQ-1042",
    categoryId: "plumbing",
    categoryName: "Plumbing Repairs",
    title: "Pipe leakage repair",
    problemDescription: "Bathroom pipe is leaking near the sink. Water is pooling on the floor — would like it looked at today if possible.",
    consumerName: "Rahul Sharma",
    consumerPhone: "+91 98199 88776",
    address: {
      houseNo: "Flat 402, Building A",
      locality: "Thane",
      city: "Thane",
      pinCode: "400601",
    },
    status: "IN_PROGRESS",
    assignedWorkerId: "worker-1",
    assignedWorkerName: "Suresh Kumar",
    preferredDate: "2026-08-28",
    preferredTimeSlot: "10:00 AM",
    amount: { base: 350, fee: 50, tax: 72, total: 472 },
    createdAt: "2026-08-28T09:41:00Z",
  },
  {
    id: "REQ-1043",
    categoryId: "electrical",
    categoryName: "Electrical Wiring & Appliances",
    title: "Ceiling fan installation",
    problemDescription: "New ceiling fan needs to be mounted and wired in the living room.",
    consumerName: "Priya Verma",
    consumerPhone: "+91 98200 99887",
    address: {
      houseNo: "Flat 101, B Wing",
      locality: "Kalwa",
      city: "Thane",
      pinCode: "400605",
    },
    status: "WORKER_ASSIGNED",
    assignedWorkerId: "worker-3",
    assignedWorkerName: "Ramesh Patil",
    preferredDate: "2026-08-28",
    preferredTimeSlot: "11:00 AM",
    amount: { base: 400, fee: 50, tax: 81, total: 531 },
    createdAt: "2026-08-28T09:52:00Z",
  },
];

export async function createServiceRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const validated = createRequestSchema.parse(req.body);
    const reqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const baseFare = 350;
    const fee = 50;
    const tax = Math.round((baseFare + fee) * 0.18);
    const total = baseFare + fee + tax;

    const newRequest: ServiceRequest = {
      id: reqId,
      categoryId: validated.categoryId,
      categoryName: validated.categoryName,
      title: validated.title,
      problemDescription: validated.problemDescription,
      consumerName: validated.consumerName || req.userName || "Rahul Sharma",
      consumerPhone: validated.consumerPhone || "+91 98199 88776",
      address: validated.address,
      status: "REQUESTED",
      preferredDate: validated.preferredDate,
      preferredTimeSlot: validated.preferredTimeSlot,
      evidencePhotos: validated.evidencePhotos || [],
      amount: { base: baseFare, fee, tax, total },
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("service_requests").insert({
        id: newRequest.id,
        category_id: newRequest.categoryId,
        category_name: newRequest.categoryName,
        title: newRequest.title,
        problem_description: newRequest.problemDescription,
        consumer_name: newRequest.consumerName,
        consumer_phone: newRequest.consumerPhone,
        address: newRequest.address,
        status: newRequest.status,
        preferred_date: newRequest.preferredDate,
        preferred_time_slot: newRequest.preferredTimeSlot,
        amount: newRequest.amount,
      });
    } catch (dbErr) {
      console.warn("Supabase insert warning:", dbErr);
    }

    inMemoryRequests.unshift(newRequest);

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: newRequest,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: "Validation failed", details: err.errors });
    } else {
      res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  }
}

export async function getServiceRequests(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, category, area } = req.query;

    let requestsList: ServiceRequest[] = [];

    try {
      const { data, error } = await supabase.from("service_requests").select("*");
      if (!error && data && data.length > 0) {
        requestsList = data.map((item) => ({
          id: item.id,
          categoryId: item.category_id,
          categoryName: item.category_name,
          title: item.title,
          problemDescription: item.problem_description,
          consumerName: item.consumer_name,
          consumerPhone: item.consumer_phone,
          address: item.address,
          status: item.status,
          assignedWorkerId: item.assigned_worker_id,
          preferredDate: item.preferred_date,
          preferredTimeSlot: item.preferred_time_slot,
          amount: item.amount,
          createdAt: item.created_at,
        }));
      } else {
        requestsList = inMemoryRequests;
      }
    } catch (dbErr) {
      requestsList = inMemoryRequests;
    }

    if (status && status !== "ALL") {
      requestsList = requestsList.filter((r) => r.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (category && category !== "ALL") {
      requestsList = requestsList.filter((r) => r.categoryId.toLowerCase() === (category as string).toLowerCase());
    }
    if (area && area !== "ALL") {
      requestsList = requestsList.filter((r) => r.address.locality.toLowerCase().includes((area as string).toLowerCase()));
    }

    res.status(200).json({
      success: true,
      count: requestsList.length,
      data: requestsList,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getServiceRequestById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const reqItem = inMemoryRequests.find((r) => r.id === id) || inMemoryRequests[0];

    res.status(200).json({
      success: true,
      data: reqItem,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function cancelServiceRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const request = inMemoryRequests.find((r) => r.id === id);

    if (!request) {
      res.status(404).json({ success: false, error: "Request not found" });
      return;
    }

    const createdTime = new Date(request.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursElapsed = (currentTime - createdTime) / (1000 * 60 * 60);

    if (hoursElapsed > 3) {
      res.status(400).json({
        success: false,
        error: "Cancellation period expired. Consumers may only cancel within 3 hours of creation.",
      });
      return;
    }

    request.status = "CANCELLED";

    res.status(200).json({
      success: true,
      message: `Service request ${id} cancelled successfully within 3-hour window.`,
      data: request,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
