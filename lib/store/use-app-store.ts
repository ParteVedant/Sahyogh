import { create } from "zustand";
import {
  UserRole,
  ServiceCategory,
  WorkerProfile,
  ServiceRequest,
  AuditLog,
  RequestStatus,
} from "../types";
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from "./mock-data";
import {
  fetchSupabaseCategories,
  fetchSupabaseWorkers,
  fetchSupabaseRequests,
  saveSupabaseRequest,
  deleteSupabaseRequest,
  saveSupabaseWorker,
  deleteSupabaseWorker,
} from "../supabase/db-init";

// ─── Logged-in user profile ─────────────────────────────────────────────────
export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "consumer" | "coordinator" | "worker";
}

interface AppState {
  // Session & Active Role
  activeRole: UserRole;
  isLoggedIn: boolean;
  loggedRole: UserRole | null;
  currentUser: CurrentUser | null;

  setActiveRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  setCurrentUser: (user: CurrentUser) => void;
  clearCurrentUser: () => void;
  logout: () => void;

  // Domain Collections
  categories: ServiceCategory[];
  workers: WorkerProfile[];
  requests: ServiceRequest[];
  auditLogs: AuditLog[];

  // Database Initialization
  initSupabaseData: () => Promise<void>;

  // Service Request CRUD Actions
  createRequest: (
    req: Omit<
      ServiceRequest,
      "id" | "status" | "createdAt" | "consumerName" | "consumerPhone" | "amount"
    >
  ) => string;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  deleteRequest: (requestId: string) => void;

  // Worker Profile CRUD Actions
  addWorker: (worker: Omit<WorkerProfile, "id">) => string;
  updateWorker: (workerId: string, data: Partial<WorkerProfile>) => void;
  deleteWorker: (workerId: string) => void;

  // Workflow Actions
  assignWorker: (requestId: string, workerId: string) => void;
  acceptJob: (requestId: string) => void;
  rejectJob: (requestId: string, reason: string) => void;
  startJob: (requestId: string) => void;
  completeJob: (requestId: string, notes: string, photos?: string[]) => void;
  processPayment: (requestId: string, paymentMethod: string) => void;
  submitRating: (requestId: string, stars: number, review?: string, issues?: string[]) => void;

  // Audit Logging
  addAuditLog: (action: string, actorName: string, actorRole: UserRole, details: string) => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeRole: "MEMBER",
  isLoggedIn: false,
  loggedRole: null,
  currentUser: null,

  setActiveRole: (role) => set({ activeRole: role }),

  loginAsRole: (role) =>
    set({
      activeRole: role,
      isLoggedIn: true,
      loggedRole: role,
    }),

  setCurrentUser: (user) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sahyog_current_user", JSON.stringify(user));
      } catch (e) {}
    }
    set({
      currentUser: user,
      isLoggedIn: true,
      loggedRole:
        user.role === "coordinator"
          ? "COOPERATIVE_ADMIN"
          : user.role === "worker"
          ? "WORKER"
          : "MEMBER",
      activeRole:
        user.role === "coordinator"
          ? "COOPERATIVE_ADMIN"
          : user.role === "worker"
          ? "WORKER"
          : "MEMBER",
    });
  },

  clearCurrentUser: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("sahyog_current_user");
      } catch (e) {}
    }
    set({
      currentUser: null,
      isLoggedIn: false,
      loggedRole: null,
      activeRole: "MEMBER",
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("sahyog_current_user");
      } catch (e) {}
    }
    set({
      activeRole: "MEMBER",
      isLoggedIn: false,
      loggedRole: null,
      currentUser: null,
    });
  },

  categories: INITIAL_CATEGORIES,
  workers: INITIAL_WORKERS,
  requests: INITIAL_REQUESTS,
  auditLogs: INITIAL_AUDIT_LOGS,

  initSupabaseData: async () => {
    try {
      const [dbCats, dbWorkers, dbReqs] = await Promise.all([
        fetchSupabaseCategories(),
        fetchSupabaseWorkers(),
        fetchSupabaseRequests(),
      ]);

      set((state) => {
        // Merge DB records with in-memory ones — DB records take priority for existing IDs
        // but in-memory-only records (just created) are preserved
        const mergeById = <T extends { id: string }>(inMemory: T[], fromDb: T[] | null): T[] => {
          if (!fromDb || fromDb.length === 0) return inMemory;
          const dbMap = new Map(fromDb.map((r) => [r.id, r]));
          const inMemoryOnlyNew = inMemory.filter((r) => !dbMap.has(r.id));
          return [...fromDb, ...inMemoryOnlyNew];
        };

        return {
          categories: dbCats || state.categories,
          workers: mergeById(state.workers, dbWorkers),
          requests: mergeById(state.requests, dbReqs),
        };
      });
    } catch (e) {
      console.warn("Using fallback local dataset for Supabase:", e);
    }
  },

  createRequest: (reqData) => {
    const newId = `REQ-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const basePrice =
      get().categories.find((c) => c.id === reqData.categoryId)?.basePrice || 350;

    // Use logged-in user's real name & phone — fall back to defaults for demo
    const cu = get().currentUser;
    const consumerName = cu?.fullName || "Consumer";
    const consumerPhone = cu?.phone || "";

    const newRequest: ServiceRequest = {
      ...reqData,
      id: newId,
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
      consumerName,
      consumerPhone,
      amount: {
        base: basePrice,
        fee: 50,
        tax: Math.round((basePrice + 50) * 0.18),
        total: Math.round((basePrice + 50) * 1.18),
      },
    };

    set((state) => ({
      requests: [newRequest, ...state.requests],
    }));

    get().addAuditLog(
      "CREATE_REQUEST",
      newRequest.consumerName,
      "MEMBER",
      `Created service request ${newId} for ${newRequest.categoryName}`
    );

    saveSupabaseRequest(newRequest);
    return newId;
  },

  updateRequestStatus: (requestId, status) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });
  },

  deleteRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== requestId),
    }));
    deleteSupabaseRequest(requestId);
    get().addAuditLog(
      "DELETE_REQUEST",
      "Consumer / Admin",
      "COOPERATIVE_ADMIN",
      `Deleted request ${requestId}`
    );
  },

  addWorker: (workerData) => {
    const newWorkerId = `WRK-${String(Math.floor(100 + Math.random() * 900))}`;
    const newWorker: WorkerProfile = {
      ...workerData,
      id: newWorkerId,
    };

    set((state) => ({
      workers: [newWorker, ...state.workers],
    }));

    saveSupabaseWorker(newWorker);
    get().addAuditLog(
      "ADD_WORKER",
      "Meera Kulkarni (Cooperative Admin)",
      "COOPERATIVE_ADMIN",
      `Added new worker ${newWorker.name} (${newWorker.workerCode})`
    );

    return newWorkerId;
  },

  updateWorker: (workerId, data) => {
    set((state) => {
      const updatedWorkers = state.workers.map((w) => {
        if (w.id === workerId) {
          const updated = { ...w, ...data };
          saveSupabaseWorker(updated);
          return updated;
        }
        return w;
      });
      return { workers: updatedWorkers };
    });
  },

  deleteWorker: (workerId) => {
    set((state) => ({
      workers: state.workers.filter((w) => w.id !== workerId),
    }));
    deleteSupabaseWorker(workerId);
    get().addAuditLog(
      "DELETE_WORKER",
      "Cooperative Admin",
      "COOPERATIVE_ADMIN",
      `Deleted worker profile ${workerId}`
    );
  },

  assignWorker: (requestId, workerId) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker) return;

    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = {
            ...r,
            assignedWorkerId: workerId,
            status: "WORKER_ASSIGNED" as RequestStatus,
          };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });

      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "ASSIGN_WORKER",
      "Meera Kulkarni (Cooperative Admin)",
      "COOPERATIVE_ADMIN",
      `Assigned ${worker.name} (${worker.workerCode}) to request ${requestId}`
    );
  },

  acceptJob: (requestId) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status: "WORKER_ACCEPTED" as RequestStatus };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "ACCEPT_JOB",
      "Assigned Worker",
      "WORKER",
      `Accepted assignment for job ${requestId}`
    );
  },

  rejectJob: (requestId, reason) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = {
            ...r,
            assignedWorkerId: undefined,
            status: "REJECTED" as RequestStatus,
          };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "REJECT_JOB",
      "Worker",
      "WORKER",
      `Rejected job ${requestId}. Reason: ${reason}`
    );
  },

  startJob: (requestId) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status: "IN_PROGRESS" as RequestStatus };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "START_JOB",
      "Worker",
      "WORKER",
      `Started execution for service ${requestId}`
    );
  },

  completeJob: (requestId, notes, photos = []) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = {
            ...r,
            status: "COMPLETION_PENDING" as RequestStatus,
            completionNotes: notes,
            evidencePhotos: photos,
          };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "COMPLETE_JOB",
      "Worker",
      "WORKER",
      `Submitted completion report for job ${requestId}`
    );
  },

  processPayment: (requestId, paymentMethod) => {
    const targetReq = get().requests.find((r) => r.id === requestId);
    const paidAmount = targetReq?.amount?.base || 400;
    const workerId = targetReq?.assignedWorkerId;

    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status: "PAID" as RequestStatus };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });

      // Automatically credit worker earnings in database
      const updatedWorkers = state.workers.map((w) => {
        if (w.id === workerId || (targetReq?.assignedWorkerName && w.name === targetReq.assignedWorkerName)) {
          const updated = {
            ...w,
            jobsCompleted: (w.jobsCompleted || 0) + 1,
            totalEarnings: (w.totalEarnings || 12000) + paidAmount,
            monthlyEarnings: (w.monthlyEarnings || 4000) + paidAmount,
            pendingPayout: (w.pendingPayout || 500) + paidAmount,
          };
          saveSupabaseWorker(updated);
          return updated;
        }
        return w;
      });

      return { requests: updatedRequests, workers: updatedWorkers };
    });

    get().addAuditLog(
      "PROCESS_PAYMENT",
      "Consumer",
      "MEMBER",
      `Paid ₹${paidAmount} for request ${requestId} via ${paymentMethod}`
    );
  },

  submitRating: (requestId, stars, review = "", issues = []) => {
    set((state) => {
      const updatedRequests = state.requests.map((r) => {
        if (r.id === requestId) {
          const updated = {
            ...r,
            status: "COMPLETED" as RequestStatus,
            rating: {
              stars,
              review,
              issues,
              createdAt: new Date().toISOString(),
            },
          };
          saveSupabaseRequest(updated);
          return updated;
        }
        return r;
      });
      return { requests: updatedRequests };
    });

    get().addAuditLog(
      "SUBMIT_RATING",
      "Consumer",
      "MEMBER",
      `Submitted ${stars} star rating for job ${requestId}`
    );
  },

  addAuditLog: (action, actorName, actorRole, details) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      action,
      actorName,
      actorRole,
      details,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  resetDemoData: () => {
    set({
      categories: INITIAL_CATEGORIES,
      workers: INITIAL_WORKERS,
      requests: INITIAL_REQUESTS,
      auditLogs: INITIAL_AUDIT_LOGS,
    });
  },
}));
