export type UserRole = "CONSUMER" | "WORKER" | "COOPERATIVE_ADMIN" | "PLATFORM_AUTHORITY";

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
  | "REJECTED"
  | "DISPUTED"
  | "NO_WORKER_AVAILABLE";

export interface ServiceAddress {
  houseNo: string;
  locality: string;
  city: string;
  pinCode: string;
}

export interface AmountBreakdown {
  base: number;
  fee: number;
  tax: number;
  total: number;
}

export interface RatingDetails {
  stars: number;
  review?: string;
  issues?: string[];
  createdAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  hindiName?: string;
  iconName: string;
  description: string;
  subServices: string[];
  basePrice: number;
}

export interface WorkerProfile {
  id: string;
  workerCode: string;
  name: string;
  phone: string;
  skills: string[];
  rating: number;
  jobsCompleted: number;
  societyName: string;
  serviceAreas: string[];
  status: "AVAILABLE" | "BUSY" | "OFFLINE";
  availableNow: boolean;
  yearsOfExperience?: number;
}

export interface ServiceRequest {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  problemDescription: string;
  consumerName: string;
  consumerPhone: string;
  address: ServiceAddress;
  status: RequestStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  rejectionReason?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  amount?: AmountBreakdown;
  completionNotes?: string;
  evidencePhotos?: string[];
  rating?: RatingDetails;
  createdAt: string;
  updatedAt?: string;
}

export interface CandidateScore {
  workerId: string;
  workerName: string;
  initials: string;
  skill: string;
  societyName: string;
  serviceAreas: string[];
  rating: number;
  jobsCompleted: number;
  distanceKm: number;
  matchScore: number;
  breakdown: {
    skillCompatibility: number;
    availability: number;
    locationProximity: number;
    experience: number;
    workloadFairness: number;
  };
  criteriaChecklist: {
    skillMatch: boolean;
    slotAvailable: boolean;
    areaCovered: boolean;
    experienceSufficient: boolean;
    workloadBalanced: boolean;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  timestamp: string;
}
