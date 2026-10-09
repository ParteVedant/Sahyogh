export type UserRole = "MEMBER" | "CONSUMER" | "WORKER" | "COOPERATIVE_ADMIN" | "PLATFORM_AUTHORITY";

export type RequestStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "ASSIGNMENT_PENDING"
  | "WORKER_ASSIGNED"
  | "WORKER_ACCEPTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETION_PENDING"
  | "COMPLETED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "INVOICED"
  | "CLOSED"
  | "CANCELLED"
  | "DISPUTED"
  | "REJECTED"
  | "NO_WORKER_AVAILABLE";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type ComplaintStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";

export type PhotoRequirement = "NOT_REQUIRED" | "OPTIONAL" | "REQUIRED";

export type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

export interface ServiceCategory {
  id: string;
  name: string;
  hindiName?: string;
  iconName: string;
  description: string;
  subServices: string[];
  workerCount?: number;
  photoRequirement?: PhotoRequirement;
  basePrice: number;
}

export interface WorkerSkill {
  id: string;
  categoryName: string;
  experienceYears: number;
}

export interface WorkerProfile {
  id: string;
  workerCode: string; // e.g. W-041
  name: string;
  phone: string;
  societyName: string;
  federationName?: string;
  verificationStatus?: VerificationStatus;
  isAvailable?: boolean;
  status?: string;
  availableNow?: boolean;
  rating: number;
  jobsCompleted: number;
  skills: string[];
  serviceAreas: string[];
  avatarUrl?: string;
  totalEarnings?: number;
  monthlyEarnings?: number;
  pendingPayout?: number;
}

export interface ServiceAddress {
  houseNo: string;
  locality: string;
  pinCode: string;
  city: string;
}

export interface ServiceRequestAmount {
  base: number;
  fee: number;
  tax: number;
  total: number;
}

export interface ServiceRequestRating {
  stars: number;
  review?: string;
  issues?: string[];
  createdAt?: string;
}

export interface ServiceRequest {
  id: string; // e.g. REQ-1001
  consumerId?: string;
  consumerName: string;
  consumerPhone: string;
  categoryId: string;
  categoryName: string;
  title: string;
  problemDescription: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string; // e.g. "Morning (8am – 12pm)"
  address: ServiceAddress;
  photos?: string[];
  evidencePhotos?: string[];
  urgent?: boolean;
  urgency?: "NORMAL" | "HIGH" | "EMERGENCY";
  status: RequestStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  rejectionReason?: string;
  createdAt: string;
  amount?: ServiceRequestAmount;
  rating?: ServiceRequestRating;
  timeline?: {
    status: RequestStatus;
    label: string;
    timestamp: string;
    description?: string;
  }[];
  completionNotes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  timestamp: string;
}
