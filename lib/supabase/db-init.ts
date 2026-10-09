import { supabase } from "./client";
import { ServiceRequest, WorkerProfile, ServiceCategory, AuditLog } from "@/lib/types";

/**
 * Fetch Service Categories from Supabase database
 */
export async function fetchSupabaseCategories(): Promise<ServiceCategory[] | null> {
  try {
    const { data, error } = await supabase.from("categories").select("*");
    if (error || !data || data.length === 0) return null;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      hindiName: item.hindi_name,
      iconName: item.icon_name,
      description: item.description || "",
      subServices: item.sub_services || [],
      basePrice: Number(item.base_price) || 0,
    }));
  } catch (err) {
    console.warn("Supabase fetch error for categories:", err);
    return null;
  }
}

/**
 * Fetch Workers from Supabase database
 */
export async function fetchSupabaseWorkers(): Promise<WorkerProfile[] | null> {
  try {
    const { data, error } = await supabase.from("workers").select("*");
    if (error || !data || data.length === 0) return null;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      workerCode: item.worker_code,
      phone: item.phone,
      skills: item.skills || [],
      rating: Number(item.rating) || 5.0,
      jobsCompleted: item.jobs_completed || 0,
      societyName: item.society_name,
      serviceAreas: item.service_areas || [],
      status: item.status || "AVAILABLE",
      availableNow: Boolean(item.available_now),
      totalEarnings: Number(item.total_earnings) || 12500,
      monthlyEarnings: Number(item.monthly_earnings) || 4500,
      pendingPayout: Number(item.pending_payout) || 800,
    }));
  } catch (err) {
    console.warn("Supabase fetch error for workers:", err);
    return null;
  }
}

/**
 * Save/Update Worker in Supabase database
 */
export async function saveSupabaseWorker(worker: WorkerProfile) {
  try {
    await supabase.from("workers").upsert({
      id: worker.id,
      name: worker.name,
      worker_code: worker.workerCode,
      phone: worker.phone,
      skills: worker.skills,
      rating: worker.rating,
      jobs_completed: worker.jobsCompleted,
      society_name: worker.societyName,
      service_areas: worker.serviceAreas,
      status: worker.status,
      available_now: worker.availableNow,
      total_earnings: worker.totalEarnings,
      monthly_earnings: worker.monthlyEarnings,
      pending_payout: worker.pendingPayout,
    });
  } catch (err) {
    console.warn("Supabase save error for worker:", err);
  }
}

/**
 * Delete Worker from Supabase database
 */
export async function deleteSupabaseWorker(workerId: string) {
  try {
    await supabase.from("workers").delete().eq("id", workerId);
  } catch (err) {
    console.warn("Supabase delete error for worker:", err);
  }
}

/**
 * Fetch Service Requests from Supabase database
 */
export async function fetchSupabaseRequests(): Promise<ServiceRequest[] | null> {
  try {
    const { data, error } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((item) => ({
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
      completionNotes: item.completion_notes,
      evidencePhotos: item.evidence_photos,
      rating: item.rating,
      createdAt: item.created_at,
    }));
  } catch (err) {
    console.warn("Supabase fetch error for service requests:", err);
    return null;
  }
}

/**
 * Insert / Update Service Request in Supabase database
 */
export async function saveSupabaseRequest(request: ServiceRequest) {
  try {
    await supabase.from("service_requests").upsert({
      id: request.id,
      category_id: request.categoryId,
      category_name: request.categoryName,
      title: request.title,
      problem_description: request.problemDescription,
      consumer_name: request.consumerName,
      consumer_phone: request.consumerPhone,
      address: request.address,
      status: request.status,
      assigned_worker_id: request.assignedWorkerId,
      preferred_date: request.preferredDate,
      preferred_time_slot: request.preferredTimeSlot,
      amount: request.amount,
      completion_notes: request.completionNotes,
      evidence_photos: request.evidencePhotos,
      rating: request.rating,
    });
  } catch (err) {
    console.warn("Supabase save error for service request:", err);
  }
}

/**
 * Delete Service Request from Supabase database
 */
export async function deleteSupabaseRequest(requestId: string) {
  try {
    await supabase.from("service_requests").delete().eq("id", requestId);
  } catch (err) {
    console.warn("Supabase delete error for service request:", err);
  }
}
