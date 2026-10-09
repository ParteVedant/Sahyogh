import { RequestStatus } from "../types";

export const SAHYOG_COLORS = {
  primary: "#173F5F",
  secondary: "#20639B",
  accent: "#F6A623",
  surface: "#FFFFFF",
  background: "#F5F7FA",
  border: "#DDE3EA",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
};

export const REQUEST_STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  REQUESTED: {
    label: "Submitted",
    bg: "bg-blue-50",
    text: "text-secondary",
    border: "border-blue-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-blue-50",
    text: "text-secondary",
    border: "border-blue-200",
  },
  ASSIGNMENT_PENDING: {
    label: "Matching Worker",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  WORKER_ASSIGNED: {
    label: "Worker Assigned",
    bg: "bg-blue-50",
    text: "text-secondary",
    border: "border-blue-200",
  },
  WORKER_ACCEPTED: {
    label: "Accepted by Worker",
    bg: "bg-emerald-50",
    text: "text-success",
    border: "border-emerald-200",
  },
  SCHEDULED: {
    label: "Scheduled",
    bg: "bg-blue-50",
    text: "text-secondary",
    border: "border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  COMPLETION_PENDING: {
    label: "Completion Submitted",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-success",
    border: "border-emerald-200",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-success",
    border: "border-emerald-200",
  },
  INVOICED: {
    label: "Invoiced",
    bg: "bg-emerald-50",
    text: "text-success",
    border: "border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-danger",
    border: "border-red-200",
  },
  REJECTED: {
    label: "Worker Rejected",
    bg: "bg-red-50",
    text: "text-danger",
    border: "border-red-200",
  },
  DISPUTED: {
    label: "Disputed",
    bg: "bg-red-50",
    text: "text-danger",
    border: "border-red-200",
  },
  NO_WORKER_AVAILABLE: {
    label: "No Worker Available",
    bg: "bg-red-50",
    text: "text-danger",
    border: "border-red-200",
  },
};
