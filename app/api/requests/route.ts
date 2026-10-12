import { NextResponse } from "next/server";
import { ServiceRequest } from "@/lib/types";
import { INITIAL_REQUESTS } from "@/lib/store/mock-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Global in-memory storage on server (persists across warm serverless lambdas on Vercel)
declare global {
  var __sahyog_requests: ServiceRequest[] | undefined;
}

function getStoredRequests(): ServiceRequest[] {
  if (!globalThis.__sahyog_requests || globalThis.__sahyog_requests.length === 0) {
    globalThis.__sahyog_requests = [...INITIAL_REQUESTS];
  }
  return globalThis.__sahyog_requests;
}

export async function GET() {
  let requests = getStoredRequests();

  // If a real Supabase database is configured, sync with it
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const dbRequests: ServiceRequest[] = data.map((item: any) => {
          const addrObj = typeof item.address === "object" && item.address ? item.address : {};
          const itemUrgency = item.urgency || addrObj.urgency || (item.urgent || addrObj.urgent ? "EMERGENCY" : "NORMAL");
          const itemUrgent = item.urgent ?? addrObj.urgent ?? (itemUrgency === "EMERGENCY" || itemUrgency === "HIGH");

          return {
            id: item.id,
            categoryId: item.category_id || "plumbing",
            categoryName: item.category_name || "General Service",
            title: item.title || "Service Requirement",
            problemDescription: item.problem_description || "",
            consumerName: item.consumer_name || "Consumer",
            consumerPhone: item.consumer_phone || "+91 98199 88776",
            address: {
              houseNo: addrObj.houseNo || "Flat 101",
              locality: addrObj.locality || "Thane",
              city: addrObj.city || "Mumbai",
              pinCode: addrObj.pinCode || "400601",
            },
            status: item.status || "REQUESTED",
            assignedWorkerId: item.assigned_worker_id,
            preferredDate: item.preferred_date || new Date().toISOString().split("T")[0],
            preferredTimeSlot: item.preferred_time_slot || "Morning (8am – 12pm)",
            amount: item.amount,
            completionNotes: item.completion_notes,
            evidencePhotos: item.evidence_photos || [],
            rating: item.rating,
            createdAt: item.created_at || new Date().toISOString(),
            urgent: itemUrgent,
            urgency: itemUrgency,
          };
        });

        const map = new Map<string, ServiceRequest>();
        dbRequests.forEach((r) => map.set(r.id, r));
        requests.forEach((r) => {
          if (!map.has(r.id)) map.set(r.id, r);
        });
        requests = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.id.localeCompare(a.id)
        );
        globalThis.__sahyog_requests = requests;
      }
    } catch {
      // Supabase unavailable; continue with server store
    }
  }

  return NextResponse.json(
    { success: true, requests },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const newReq: ServiceRequest = await request.json();
    if (!newReq || !newReq.id) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const current = getStoredRequests();
    // Ensure priority flags are sound
    const urgency = newReq.urgency || (newReq.urgent ? "EMERGENCY" : "NORMAL");
    const urgent = newReq.urgent ?? (urgency === "EMERGENCY" || urgency === "HIGH");

    const completeReq: ServiceRequest = {
      ...newReq,
      urgency,
      urgent,
      createdAt: newReq.createdAt || new Date().toISOString(),
    };

    // Prepend to server store
    const updated = [completeReq, ...current.filter((r) => r.id !== completeReq.id)];
    globalThis.__sahyog_requests = updated;

    // Mirror to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const addressPayload = {
          ...completeReq.address,
          urgency: completeReq.urgency,
          urgent: completeReq.urgent,
        };
        await supabase.from("service_requests").upsert({
          id: completeReq.id,
          category_id: (completeReq.categoryId || "plumbing").toLowerCase(),
          category_name: completeReq.categoryName,
          title: completeReq.title,
          problem_description: completeReq.problemDescription,
          consumer_name: completeReq.consumerName,
          consumer_phone: completeReq.consumerPhone,
          address: addressPayload,
          status: completeReq.status,
          assigned_worker_id: completeReq.assignedWorkerId || null,
          preferred_date: completeReq.preferredDate,
          preferred_time_slot: completeReq.preferredTimeSlot,
          amount: completeReq.amount || null,
          completion_notes: completeReq.completionNotes || null,
          evidence_photos: completeReq.evidencePhotos || [],
          rating: completeReq.rating || null,
        });
      } catch {}
    }

    return NextResponse.json({ success: true, request: completeReq, requests: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const current = getStoredRequests();
    let updatedItem: ServiceRequest | null = null;
    const updatedList = current.map((r) => {
      if (r.id === id) {
        updatedItem = { ...r, ...data };
        return updatedItem;
      }
      return r;
    });

    globalThis.__sahyog_requests = updatedList;

    if (isSupabaseConfigured && updatedItem) {
      try {
        await supabase
          .from("service_requests")
          .update({
            status: (updatedItem as ServiceRequest).status,
            assigned_worker_id: (updatedItem as ServiceRequest).assignedWorkerId || null,
            completion_notes: (updatedItem as ServiceRequest).completionNotes || null,
            rating: (updatedItem as ServiceRequest).rating || null,
          })
          .eq("id", id);
      } catch {}
    }

    return NextResponse.json({ success: true, request: updatedItem, requests: updatedList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const current = getStoredRequests();
    globalThis.__sahyog_requests = current.filter((r) => r.id !== id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from("service_requests").delete().eq("id", id);
      } catch {}
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
