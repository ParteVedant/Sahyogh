# Cooperative Gig Services Platform
## System Architecture

**Version:** 1.0  
**Architecture Style:** Modular layered architecture

---

## 1. High-Level Architecture

```text
┌────────────────────┐
│   Consumer PWA     │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│    Worker PWA      │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│  Admin Dashboard   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   API / Auth Layer │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────┐
│        Application Modules         │
│ Requests | Eligibility | Schedule │
│ Assignment | Execution | Payment  │
│ Invoice | Rating | Complaint      │
│ Welfare | Notification | Audit    │
└─────────┬──────────────────────────┘
          │
          ▼
┌────────────────────┐
│ Domain/Data Layer  │
└──────┬────────┬────┘
       │        │
       ▼        ▼
 PostgreSQL   Object Storage
       │
       └──────────────┐
                      ▼
             External Services
       Payment | Maps | Notifications
```

---

## 2. Architectural Principle

The cooperative is not bypassed.

```text
Consumer
   ↓
Platform
   ↓
Cooperative Administrator
   ↓
Verified Worker
```

The platform supports the administrator's decision instead of replacing it.

---

## 3. Client Architecture

### Consumer

Responsible for:

- Account
- Service selection
- Request
- Scheduling
- Location
- Photos
- Tracking
- Payment
- Invoice
- Rating
- Complaints

### Worker

Responsible for:

- Profile
- Verification
- Skills
- Certifications
- Availability
- Job queue
- Accept/reject
- Start/complete
- Completion evidence
- Payment/earnings status

### Administrator

Responsible for:

- Requests
- Candidate workers
- Manual assignment
- Scheduling
- Reassignment
- Worker records
- Complaints
- Performance
- Welfare
- Reports

---

## 4. Backend Modules

```text
/auth
/users
/consumers
/workers
/cooperatives
/services
/requests
/eligibility
/assignments
/scheduling
/execution
/payments
/invoices
/ratings
/complaints
/welfare
/notifications
/verification
/audit
```

Each module should expose clear service boundaries.

---

## 5. Authentication Flow

```text
User
 ↓
Login
 ↓
Authentication Provider
 ↓
Session/JWT
 ↓
Role
 ↓
RBAC
 ↓
Resource Authorization
 ↓
Application
```

---

## 6. Consumer Request Flow

```text
Consumer
   ↓
Select Service
   ↓
Enter Requirements
   ↓
Schedule + Location
   ↓
Conditional Photo
   ↓
Submit
   ↓
Backend Validation
   ↓
Service Request Created
   ↓
ASSIGNMENT_PENDING
   ↓
Admin Notification
```

---

## 7. Eligibility Architecture

```text
Service Request
       ↓
Eligibility Engine
       ↓
Organization
       ↓
Verification
       ↓
Operational Status
       ↓
Skill
       ↓
Certification
       ↓
Service Area
       ↓
Availability
       ↓
Schedule Conflict
       ↓
Eligible Candidates
       ↓
Administrator
```

The eligibility engine is a decision-support component, not an automatic assignment engine.

---

## 8. Manual Assignment

```text
Administrator
      ↓
Candidate List
      ↓
Review worker details
      ↓
Select worker
      ↓
Backend re-checks eligibility
      ↓
Transaction
      ↓
Assignment created
      ↓
Worker notification
```

This final re-check prevents stale candidate information from creating double bookings or invalid assignments.

---

## 9. Worker Acceptance

```text
Worker receives job
        ↓
Review:
- Service
- Date/time
- Location
- Instructions
- Evidence
        ↓
Accept / Reject
```

### Accept

```text
WORKER_ASSIGNED
      ↓
WORKER_ACCEPTED
      ↓
SCHEDULED
```

### Reject

```text
WORKER_ASSIGNED
      ↓
REJECTED
      ↓
Admin Assignment Queue
```

---

## 10. Scheduling Architecture

```text
Requested Slot
      +
Worker Availability
      +
Existing Assignments
      +
Estimated Duration
      ↓
Conflict Engine
      ↓
Available / Conflict
```

A worker cannot be assigned to overlapping jobs.

---

## 11. Service Execution

```text
Scheduled
   ↓
Worker arrives
   ↓
Start
   ↓
IN_PROGRESS
   ↓
Perform service
   ↓
Completion information
   ↓
Required evidence
   ↓
COMPLETION_PENDING
```

Evidence requirements are determined by the service category.

---

## 12. Completion and Consumer Confirmation

```text
Worker completes
      ↓
Consumer notified
      ↓
┌───────────────┬────────────────┐
│ Confirm       │ Report problem │
└───────┬───────┴───────┬────────┘
        ↓               ↓
      Payment       Complaint
```

---

## 13. Payment Architecture

```text
Final Approved Amount
        ↓
Payment Order
        ↓
Consumer
        ↓
Razorpay / Payment Gateway
        ↓
Webhook
        ↓
Server Verification
        ↓
Payment Status
        ↓
Invoice
```

Payment state is controlled by verified server-side gateway events.

---

## 14. Complaint Architecture

```text
Consumer
   ↓
Complaint
   ↓
Admin Queue
   ↓
Worker Response
   ↓
Evidence Review
   ↓
Administrator Investigation
   ↓
Decision
   ↓
Resolution / Refund
```

The complaint service must preserve the full case history.

---

## 15. Cancellation Architecture

### Consumer

```text
Worker Approval
      ↓
3-hour window
      ↓
Consumer cancellation
      ↓
Reason optional
      ↓
Audit
```

### Worker

```text
Worker cancellation
      ↓
Admin notification
      ↓
Audit
      ↓
Find replacement
      ↓
Reassign
      ↓
Consumer notification
```

---

## 16. Notification Architecture

```text
Domain Event
     ↓
Notification Service
     ↓
Recipient Resolver
     ↓
In-App / Push / SMS
     ↓
Delivery Record
```

Example:

```text
WorkerAccepted
     ↓
Notification Service
     ↓
Consumer
     ↓
"Your worker has accepted the service request."
```

---

## 17. Data Architecture

### PostgreSQL

Stores structured records:

- Users
- Cooperatives
- Workers
- Services
- Requests
- Assignments
- Scheduling
- Payments
- Complaints
- Ratings
- Audit records

### Object Storage

Stores:

- Verification documents
- Certification files
- Service images
- Complaint evidence
- Invoice documents

Database records contain secure file references.

---

## 18. Privacy Architecture

```text
Authentication
      ↓
Role Check
      ↓
Resource Ownership
      ↓
Field-Level Sensitivity Check
      ↓
Response
```

Example:

Consumer may receive:

```text
Worker Name
Worker Photo
Worker Rating
Relevant Skills
```

Consumer must not receive:

```text
Aadhaar number
Payment identifier
Certificate documents
Internal welfare records
Internal cooperative records
```

---

## 19. Verification Architecture

```text
Registration
     ↓
Document/Data Submission
     ↓
Verification Queue
     ↓
Platform Authority / Authorized Admin
     ↓
Approved
OR
Rejected
```

For workers:

```text
Identity
+
Cooperative Membership
+
Skills
+
Certifications
```

For administrators:

```text
Identity
+
Federation Information
+
Authorization
```

---

## 20. Low-Bandwidth Architecture

```text
Client
  ↓
Compressed Payload
  ↓
API
  ↓
Cache
  ↓
Database
```

Client may maintain:

- Cached service categories
- Recently loaded job information
- Pending safe operations

Payment, assignment, and critical state changes require server confirmation.

---

## 21. Audit Architecture

Important action:

```text
Actor
+
Action
+
Target
+
Timestamp
+
Before/After
      ↓
AuditLog
```

Example:

```text
Admin
ASSIGN_WORKER
Request #123
Worker #456
2026-08-27T...
```

---

## 22. Future AI Boundary

The MVP produces structured operational data.

```text
Historical Requests
+
Service Category
+
Location
+
Time
+
Worker Availability
+
Completion History
        ↓
Future Analytics Layer
        ↓
Demand Forecast
        ↓
Admin Recommendation
```

Future AI should initially recommend rather than automatically control workforce allocation.

---

## 23. External Services

```text
Platform Backend
 ├── Payment Gateway
 ├── Maps/Geolocation Provider
 ├── Push Notification Service
 ├── SMS Provider
 └── Object Storage
```

External service failures must have graceful error handling.

---

## 24. Security Boundary

```text
Internet
   ↓
HTTPS
   ↓
API
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Rules
   ↓
Database
```

Sensitive files remain private and are accessed through authorized requests.

---

## 25. Architecture Principles

1. Manual cooperative-controlled assignment.
2. Configurable service behavior.
3. Explicit job state transitions.
4. Server-side payment verification.
5. Transactional scheduling/assignment.
6. Least-privilege access.
7. Data minimization.
8. Complete auditability.
9. Low-bandwidth optimization.
10. Modular future extensibility.
