# Cooperative Gig Services Platform
## Technical Specification

**Version:** 1.0  
**Status:** MVP Baseline

---

## 1. Recommended Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Progressive Web App capabilities

### Backend

- Node.js
- TypeScript
- NestJS or modular Express architecture
- REST API

### Database

- PostgreSQL
- Prisma ORM

### Object Storage

S3-compatible storage or Supabase Storage for images/documents.

### Payments

Razorpay or another gateway approved for the deployment environment.

### Maps

A geolocation/maps provider suitable for the target region and budget.

---

## 2. Application Structure

Three primary role experiences:

- `/consumer`
- `/worker`
- `/admin`

Platform verification functions may be protected admin routes rather than a fourth public application.

---

## 3. Core Modules

- Authentication
- Users
- Consumers
- Workers
- Cooperatives
- Services
- Service Rules
- Requests
- Eligibility
- Assignments
- Scheduling
- Service Execution
- Payments
- Invoices
- Ratings
- Complaints
- Welfare
- Notifications
- Verification
- Audit

---

## 4. Core Entities

- User
- ConsumerProfile
- WorkerProfile
- AdminProfile
- Federation
- CooperativeSociety
- ServiceCategory
- ServiceRule
- WorkerSkill
- Certification
- WorkerAvailability
- ServiceRequest
- ServiceAssignment
- ServiceExecution
- Payment
- Invoice
- Rating
- Complaint
- Refund
- WelfareRecord
- Verification
- Notification
- AuditLog

---

## 5. User

Suggested fields:

- `id`
- `name`
- `phone`
- `email`
- `passwordHash` or external auth ID
- `role`
- `accountStatus`
- `createdAt`
- `updatedAt`

---

## 6. Worker Profile

Suggested fields:

- `id`
- `userId`
- `photoUrl`
- `gender`
- `serviceArea`
- `latitude`
- `longitude`
- `cooperativeSocietyId`
- `verificationStatus`
- `operationalStatus`
- `performanceScore`
- `averageRating`
- `createdAt`
- `updatedAt`

Sensitive identity fields should be stored separately with stricter access control.

---

## 7. Cooperative Structure

### Federation

- `id`
- `name`
- `identifier`
- `verificationStatus`
- `address`

### Cooperative Society

- `id`
- `federationId`
- `name`
- `ncdId`
- `verificationStatus`

Relationship:

`Federation 1 → N CooperativeSociety`

`CooperativeSociety 1 → N Worker`

The exact NCD-ID specification must be verified against the relevant authoritative source before production use.

---

## 8. Service Category

Fields:

- `id`
- `name`
- `description`
- `active`
- `estimatedDuration`
- `photoRequirement`
- `requiredWorkerCount`

---

## 9. Service Rule

Rules define service-specific behavior:

- Required skills
- Required certifications
- Photo requirement
- Estimated duration
- Material information
- Worker count
- Additional questions

Possible photo enum:

- `NOT_REQUIRED`
- `OPTIONAL`
- `REQUIRED`

---

## 10. Service Request

Fields:

- `id`
- `consumerId`
- `serviceCategoryId`
- `description`
- `scheduledDate`
- `scheduledStartTime`
- `estimatedDuration`
- `locationAddress`
- `latitude`
- `longitude`
- `additionalInstructions`
- `requiredWorkerCount`
- `status`
- `createdAt`
- `updatedAt`

Photo evidence is stored through object-storage references.

---

## 11. Request Status

Recommended:

`REQUESTED`

`UNDER_REVIEW`

`ASSIGNMENT_PENDING`

`WORKER_ASSIGNED`

`WORKER_ACCEPTED`

`SCHEDULED`

`IN_PROGRESS`

`COMPLETION_PENDING`

`COMPLETED`

`PAYMENT_PENDING`

`PAID`

`INVOICED`

`CLOSED`

`CANCELLED`

`DISPUTED`

`NO_WORKER_AVAILABLE`

---

## 12. Assignment

Fields:

- `id`
- `requestId`
- `workerId`
- `assignedBy`
- `assignedAt`
- `responseStatus`
- `respondedAt`
- `rejectionReason`

Do not overwrite assignment history.

---

## 13. Eligibility Engine

Input:

- Service request
- Required skill
- Certification rules
- Organization
- Location/service area
- Date/time
- Duration
- Worker count

Filtering:

```text
Verified?
    ↓ yes
Active?
    ↓ yes
Correct cooperative relationship?
    ↓ yes
Required skill?
    ↓ yes
Required certification?
    ↓ yes
Available?
    ↓ yes
Schedule conflict?
    ↓ no
Eligible candidate
```

Output:

A candidate list for the administrator.

The engine must not perform final automatic assignment.

---

## 14. Scheduling

Worker availability contains:

- Date
- Start time
- End time
- Availability status

Conflict detection checks:

`existingJobStart < newJobEnd`

AND

`existingJobEnd > newJobStart`

If both are true, the assignment conflicts.

A final check must occur inside the assignment transaction.

---

## 15. Service Execution

Fields:

- `id`
- `requestId`
- `workerId`
- `startedAt`
- `completedAt`
- `completionNotes`
- `beforeEvidence`
- `afterEvidence`
- `status`

Evidence is conditional on service rules.

---

## 16. Pricing

MVP pricing model:

```text
Cooperative base service rate
+
Complexity/material charges
=
Final approved amount
```

The approved amount is stored against the request/order.

Do not implement an unapproved revenue-split formula.

---

## 17. Payment Integration

Recommended flow:

```text
Final approved amount
        ↓
Create payment order
        ↓
Consumer payment UI
        ↓
Payment gateway
        ↓
Gateway callback/webhook
        ↓
Server-side verification
        ↓
Payment SUCCESS/FAILED
```

Never trust only the frontend payment-success response.

Payment entity:

- `id`
- `requestId`
- `consumerId`
- `amount`
- `currency`
- `provider`
- `providerOrderId`
- `providerPaymentId`
- `status`
- `createdAt`
- `updatedAt`

States:

- `PENDING`
- `SUCCESS`
- `FAILED`
- `REFUND_PENDING`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

---

## 18. Invoice

Fields:

- `id`
- `requestId`
- `invoiceNumber`
- `amount`
- `paymentId`
- `issuedAt`
- `documentUrl`
- `status`

Invoice access must be role-protected.

---

## 19. Rating

Fields:

- `id`
- `requestId`
- `consumerId`
- `workerId`
- `score`
- `feedback`
- `createdAt`

Only the consumer associated with the job can rate that worker for that job.

---

## 20. Performance Score

Performance score may aggregate:

- Rating
- Completion rate
- Acceptance behavior
- Cancellation behavior
- Complaint history
- Consistency

The exact weighted formula and bonus calculation remain deferred until financial/operational policy is approved.

---

## 21. Complaints

Fields:

- `id`
- `requestId`
- `consumerId`
- `workerId`
- `category`
- `description`
- `evidence`
- `status`
- `workerResponse`
- `adminDecision`
- `createdAt`
- `resolvedAt`

Statuses:

- `OPEN`
- `UNDER_REVIEW`
- `RESOLVED`
- `REJECTED`

---

## 22. Refunds

Refund creation requires administrator investigation.

Flow:

```text
Complaint
   ↓
Investigation
   ↓
Evidence + worker response
   ↓
Admin decision
   ↓
Refund request
   ↓
Payment provider
   ↓
Refund result
```

---

## 23. Cancellation Rules

### Consumer

Three-hour cancellation window begins from the recorded worker-approval timestamp.

The backend must calculate the window using server time.

### Worker

Worker cancellation creates an audit event and returns the job to administrator assignment.

---

## 24. Authentication and Authorization

Every protected request requires:

1. Authentication
2. Role authorization
3. Resource authorization
4. Business-rule validation

Roles:

- `CONSUMER`
- `WORKER`
- `COOPERATIVE_ADMIN`
- `PLATFORM_AUTHORITY`

---

## 25. File Uploads

Files include:

- Worker photos
- Certificates
- Federation documents
- Service photos
- Complaint evidence

Controls:

- Size limits
- MIME validation
- Extension validation
- Secure object storage
- Private access by default
- Signed URLs where appropriate
- Malware scanning where feasible

---

## 26. Location

Store only the location required for service operation.

Potential fields:

- Address
- Latitude
- Longitude

The MVP does not continuously track workers.

---

## 27. Notifications

Events generate notifications.

Examples:

- Request created
- Worker assigned
- Worker accepted
- Worker rejected
- Worker cancelled
- Reassignment
- Service completed
- Payment success/failure
- Complaint created/resolved

Channels:

- In-app
- Push
- SMS for selected critical events if feasible

---

## 28. Audit Log

Fields:

- `id`
- `actorId`
- `actorRole`
- `action`
- `entityType`
- `entityId`
- `previousValue`
- `newValue`
- `timestamp`
- `metadata`

Audit at minimum:

- Verification decisions
- Assignments
- Reassignments
- Cancellations
- Completion
- Payment/refund decisions
- Complaint decisions
- Role/status changes

---

## 29. Low-Bandwidth

- Compress images client-side.
- Use pagination.
- Keep payloads small.
- Cache service categories and previously loaded job data.
- Retry transient requests.
- Queue safe noncritical operations.
- Synchronize after reconnection.
- Clearly show offline/online state.

Offline-assisted behavior must never silently duplicate payment, assignment, or completion actions.

---

## 30. Concurrency

Critical operations use transactions.

Especially:

- Worker assignment
- Availability update
- Payment state transition
- Refund state transition

The assignment operation must re-check availability inside the transaction.

---

## 31. Security

Minimum controls:

- HTTPS
- Password hashing
- Secure tokens/sessions
- RBAC
- Resource-level authorization
- Input validation
- Rate limiting
- Secure file access
- Secrets management
- Audit logging
- Database backups
- Error handling without sensitive leakage

---

## 32. API Examples

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Consumer

```text
POST /api/service-requests
GET  /api/service-requests
GET  /api/service-requests/:id
POST /api/service-requests/:id/cancel
```

### Worker

```text
GET  /api/worker/jobs
GET  /api/worker/jobs/:id
POST /api/worker/jobs/:id/accept
POST /api/worker/jobs/:id/reject
POST /api/worker/jobs/:id/start
POST /api/worker/jobs/:id/complete
```

### Admin

```text
GET  /api/admin/requests
GET  /api/admin/workers
GET  /api/admin/requests/:id/candidates
POST /api/admin/requests/:id/assign
GET  /api/admin/complaints
POST /api/admin/complaints/:id/resolve
```

### Payments

```text
POST /api/payments/orders
POST /api/payments/webhook
GET  /api/payments/:id
```

---

## 33. State Transition Protection

The backend must reject invalid transitions.

Example:

```text
REQUESTED
   ↓
ASSIGNMENT_PENDING
   ↓
WORKER_ASSIGNED
   ↓
WORKER_ACCEPTED
   ↓
SCHEDULED
   ↓
IN_PROGRESS
   ↓
COMPLETION_PENDING
   ↓
COMPLETED
   ↓
PAYMENT
   ↓
CLOSED
```

Clients must not be allowed to directly set arbitrary status values.

---

## 34. Testing Requirements

### Unit

- Eligibility
- Scheduling conflicts
- Cancellation window
- State transitions
- Permission checks
- Pricing calculation
- Performance calculation

### Integration

- Request → assignment
- Assignment → acceptance
- Completion → payment
- Payment → invoice
- Complaint → investigation
- Refund → provider

### E2E

Consumer golden path  
Worker golden path  
Admin golden path  
Worker rejection  
Worker cancellation  
Complaint  
Payment failure  
Low-network retry

---

## 35. Performance Targets

Under normal prototype conditions:

- Typical API response: target <500 ms
- Critical operations: target <1 second where practical
- Paginated lists
- Optimized database queries
- Compressed media

These are engineering targets, not guarantees.

---

## 36. Deployment

Prototype:

- Frontend: Vercel or equivalent
- Backend: managed Node.js hosting
- Database: managed PostgreSQL
- Storage: managed object storage
- Payment gateway: Razorpay test/live environment as appropriate

Production deployment requires security review, backups, monitoring, and appropriate compliance controls.
