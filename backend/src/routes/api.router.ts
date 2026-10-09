import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { rateLimiter } from "../middleware/rate-limiter";
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  cancelServiceRequest,
} from "../modules/requests/request.controller";
import {
  getAdminDashboardStats,
  getRequestCandidates,
  assignWorkerToRequest,
} from "../modules/admin/admin.controller";
import {
  getWorkerJobs,
  acceptWorkerJob,
  rejectWorkerJob,
  startWorkerJob,
  completeWorkerJob,
  getWorkerEarnings,
} from "../modules/worker/worker.controller";
import {
  getInvoiceByRequestId,
  submitWorkerRating,
} from "../modules/billing/invoice.controller";
import {
  createComplaint,
  getComplaintsQueue,
  resolveComplaint,
} from "../modules/complaints/complaint.controller";
import { getAuditLogs } from "../modules/audit/audit.controller";

export const apiRouter = Router();

// Apply Rate Limiter globally to all API routes
apiRouter.use(rateLimiter);

// Health Check
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "Sahyog Cooperative REST API Engine",
    version: "v1.0",
    timestamp: new Date().toISOString(),
  });
});

// Service Request Routes
apiRouter.post("/requests", requireAuth(["CONSUMER", "MEMBER" as any]), createServiceRequest);
apiRouter.get("/requests", requireAuth(), getServiceRequests);
apiRouter.get("/requests/:id", requireAuth(), getServiceRequestById);
apiRouter.post("/requests/:id/cancel", requireAuth(["CONSUMER", "MEMBER" as any]), cancelServiceRequest);

// Admin Console Routes
apiRouter.get("/admin/dashboard-stats", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), getAdminDashboardStats);
apiRouter.post("/requests/:id/candidates", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), getRequestCandidates);
apiRouter.post("/requests/:id/assign", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), assignWorkerToRequest);

// Worker Experience Routes
apiRouter.get("/worker/jobs", requireAuth(["WORKER"]), getWorkerJobs);
apiRouter.post("/jobs/:id/accept", requireAuth(["WORKER"]), acceptWorkerJob);
apiRouter.post("/jobs/:id/reject", requireAuth(["WORKER"]), rejectWorkerJob);
apiRouter.post("/jobs/:id/start", requireAuth(["WORKER"]), startWorkerJob);
apiRouter.post("/jobs/:id/complete", requireAuth(["WORKER"]), completeWorkerJob);
apiRouter.get("/worker/earnings", requireAuth(["WORKER"]), getWorkerEarnings);
apiRouter.get("/worker/welfare", requireAuth(["WORKER", "COOPERATIVE_ADMIN"]), (req, res) => {
  res.status(200).json({
    success: true,
    insuranceStatus: "ACTIVE",
    policyNumber: "POL-COOP-2026-99",
    coverageAmount: 200000,
    welfareFundBalance: 15000,
  });
});

// Complaints & Refunds Routes
apiRouter.post("/complaints", requireAuth(["CONSUMER", "MEMBER" as any]), createComplaint);
apiRouter.get("/complaints", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), getComplaintsQueue);
apiRouter.post("/complaints/:id/resolve", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), resolveComplaint);

// Invoice & Rating Routes
apiRouter.get("/invoices/:id", requireAuth(), getInvoiceByRequestId);
apiRouter.post("/ratings", requireAuth(["CONSUMER", "MEMBER" as any]), submitWorkerRating);

// Audit Trail & Notifications Routes
apiRouter.get("/audit-logs", requireAuth(["COOPERATIVE_ADMIN", "PLATFORM_AUTHORITY"]), getAuditLogs);
apiRouter.get("/notifications", requireAuth(), (req, res) => {
  res.status(200).json({
    success: true,
    notifications: [
      {
        id: "NOTIF-01",
        title: "Assignment Update",
        message: "Worker Suresh Kumar assigned to request REQ-1042",
        read: false,
        timestamp: new Date().toISOString(),
      },
    ],
  });
});
