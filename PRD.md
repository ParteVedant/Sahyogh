# Cooperative Gig Services Platform
## Product Requirements Document

**Version:** 1.0  
**Status:** MVP Baseline  
**Problem Statement:** Cooperative Gig Services Platform for Household & Community Services

---

## 1. Product Vision

Build a cooperative-owned digital service marketplace that connects consumers with verified skilled workers belonging to Labour Cooperative Societies and Federations.

The platform keeps the cooperative administrator at the center of workforce allocation:

Consumer → Platform → Cooperative Administrator → Verified Worker

The system digitizes service discovery, request management, scheduling, worker assignment, service execution, payment, invoicing, ratings, complaints, and basic worker welfare information.

---

## 2. Problem

Labour Cooperative Federations and Societies have skilled workers such as electricians, plumbers, carpenters, painters, cleaners, caregivers, drivers, gardeners, and technicians. Many workers remain underutilized because they lack a structured digital channel for reaching households and communities.

Consumers also need a trusted way to find verified local service providers.

The platform addresses both sides while preserving cooperative governance.

---

## 3. Goals

### Primary goals

- Connect consumers to cooperative workers.
- Digitize service requests and job allocation.
- Maintain verified worker and cooperative records.
- Let administrators manually assign suitable workers.
- Prevent obvious scheduling conflicts.
- Provide service-status transparency.
- Enable digital payment and invoice records.
- Provide ratings and complaint handling.
- Maintain worker performance and welfare information.
- Support low-bandwidth usage.

### Non-goals for MVP

- Fully automatic worker assignment.
- Emergency/on-demand booking.
- AI demand forecasting.
- AI workforce allocation.
- Live worker tracking.
- Full insurance claims management.
- Advanced HR/payroll software.
- Complex cooperative/platform/worker settlement rules.

---

## 4. Users

### Consumer

Requests and schedules services, provides requirements/location/evidence where applicable, pays, confirms completion, rates the worker, and can raise complaints.

### Cooperative Administrator

Reviews requests, views eligible workers, manually assigns workers, monitors jobs, handles cancellations/reassignments, investigates complaints, and maintains workforce information.

### Worker

Maintains profile and skills, submits verification information, manages availability, accepts/rejects assignments, performs jobs, and submits completion information.

### Platform Verification Authority

Verifies cooperative administrators and organizational records.

---

## 5. Three Primary Interfaces

1. Consumer application/PWA
2. Worker application/PWA
3. Cooperative administrator web dashboard

A platform-level verification module may be part of the admin application.

---

## 6. Consumer Workflow

1. Register/login.
2. Select required service.
3. Enter service requirement.
4. Select date/time.
5. Enter service location.
6. Upload a photo when the service category requires or benefits from one.
7. Add additional instructions.
8. Review request.
9. Submit request.
10. Track request status.
11. After administrator assignment and worker acceptance, view relevant worker information.
12. Receive service.
13. Pay through the integrated payment flow.
14. Confirm completion or report a problem.
15. Receive invoice.
16. Rate/review the worker.

### Consumer-visible worker information

- Name
- Photo
- Rating
- Relevant skills
- Scheduled service information
- Distance/area information where appropriate

Sensitive worker documents and personal identifiers are never exposed to consumers.

---

## 7. Service Request

A request contains:

- Request ID
- Consumer
- Service category
- Service description
- Date
- Preferred time
- Estimated duration
- Location
- Conditional photos
- Additional instructions
- Required worker count
- Status
- Timestamps

---

## 8. Conditional Photo Requirement

Photo upload is configurable by service category.

Examples:

- Machine/appliance repair: useful/possibly required.
- Painting: useful/possibly required.
- Household repair: useful/possibly required.
- Massage or services where visual evidence is unnecessary: not required.

The platform must not force photographs for every service.

---

## 9. Service Categories

Each service category can define:

- Required skills
- Required certifications
- Photo requirement
- Estimated duration
- Material information
- Required worker count
- Other category-specific questions

This makes the marketplace extensible without hard-coding identical workflows for all services.

---

## 10. Pricing

Pricing follows the agreed model:

Cooperative base service rate  
+  
Complexity/material charges  
↓  
Final approved amount

The MVP must support displaying and storing the approved amount.

Detailed financial settlement/split rules are deferred until the cooperative's financial policy is confirmed.

---

## 11. Administrator Workflow

New request
↓
Review requirement
↓
Platform filters eligible workers
↓
Administrator reviews candidates
↓
Administrator manually selects worker
↓
Worker receives assignment
↓
Worker accepts/rejects
↓
If accepted → scheduled job
If rejected → administrator reassigns

The platform recommends/filter candidates but never automatically makes the final assignment.

---

## 12. Worker Eligibility

Candidate filtering considers:

- Verified status
- Active status
- Cooperative/society relationship
- Required skill
- Required certification
- Service area
- Availability
- Existing assignments
- Schedule compatibility
- Required worker count

The administrator remains the final decision-maker.

---

## 13. Worker Workflow

1. Register.
2. Complete profile.
3. Upload required verification information.
4. Add skills.
5. Add certifications.
6. Select cooperative society.
7. Provide validated organizational identifier information such as NCD-ID where applicable.
8. Set service area/location.
9. Set availability.
10. Receive assignment.
11. Review job details.
12. Accept/reject.
13. View schedule and location.
14. Start service.
15. Perform work.
16. Submit completion information/evidence when applicable.
17. View payment/earnings status.

The worker interface must remain lightweight and simple for users with limited digital literacy or connectivity.

---

## 14. Worker Profile

Potential fields:

- Name
- Photo
- Gender
- Service area/location
- Skills
- Certifications
- Cooperative society
- Federation relationship
- Organizational identifier/NCD-ID
- Verification status
- Availability
- Performance history
- Welfare/insurance status

Highly sensitive identity and payment information must be protected and minimized.

---

## 15. Cooperative Structure

Federation
↓
Cooperative Society
↓
Worker

The system must preserve the relationship between a worker, their society, and the federation.

The NCD-ID concept is used to identify the relevant cooperative organizational relationship. Its exact official format and validation source must be confirmed before production implementation.

---

## 16. Administrator Verification

Administrator registration requires relevant:

- Identity information
- Photograph
- Federation details
- Federation identification/documentation
- Authorization information

Account states:

PENDING → UNDER REVIEW → VERIFIED

or

PENDING → REJECTED

Only verified administrators can manage operational requests.

---

## 17. Worker Verification

Worker verification should establish:

- Identity
- Cooperative membership
- Skills
- Certifications where required
- Relevant organizational relationship

Account states:

PENDING → UNDER REVIEW → VERIFIED

or

PENDING → REJECTED

Verification status and operational availability are separate.

---

## 18. Scheduling

The system must prevent obvious double-booking.

Before assignment it checks:

Worker availability  
+ existing assignments  
+ requested time  
+ estimated duration

The backend performs a final availability check at assignment time to protect against race conditions.

---

## 19. Worker Cancellation

Worker cancellation:

Worker cancels
↓
Administrator notified
↓
Cancellation audited
↓
Administrator finds replacement
↓
Replacement assigned
↓
Consumer notified

---

## 20. Consumer Cancellation

A consumer may cancel within 3 hours of worker approval under the agreed MVP rule.

Cancellation reason is optional.

Cancellation is recorded for audit and operational analytics.

---

## 21. Service Execution

Scheduled
↓
Worker reaches service location
↓
Start service
↓
In progress
↓
Complete service
↓
Completion submitted

Applicable services may require before/after evidence.

---

## 22. Completion and Consumer Confirmation

Worker submits completion.

Consumer can:

- Confirm completion
- Report a problem

Worker completion and consumer confirmation are separate events so that a consumer can dispute an incomplete or unsatisfactory service.

---

## 23. Payment

The project will use a payment gateway such as Razorpay for in-app payment in the MVP.

Conceptual flow:

Approved service amount
↓
Payment order
↓
Consumer pays
↓
Gateway verification/webhook
↓
Payment marked successful
↓
Invoice/transaction record

The previously considered OTP payment/completion mechanism is not used.

### Deferred financial policy

The exact cooperative/platform/worker money split and weekly worker settlement mechanism require a verified financial policy and are not hard-coded into the MVP requirements.

---

## 24. Invoice

The system generates a digital invoice/transaction record containing relevant:

- Invoice number
- Request/job ID
- Service
- Approved amount
- Payment status
- Date/time
- Consumer information
- Cooperative information where appropriate

---

## 25. Rating and Performance

Consumer can submit:

- 1–5 star rating
- Optional feedback

Performance score can consider:

- Rating
- Completion consistency
- Acceptance/rejection behavior
- Cancellation behavior
- Complaint history
- Other approved operational metrics

The exact bonus formula is deferred.

---

## 26. Complaints

Consumer submits:

- Complaint category
- Description
- Evidence where applicable

Complaint lifecycle:

OPEN
↓
UNDER REVIEW
↓
WORKER RESPONSE
↓
ADMIN INVESTIGATION
↓
RESOLUTION

Possible resolution:

- No action
- Service correction/reassignment
- Partial refund
- Full refund
- Other approved resolution

Refund decisions require administrator investigation.

The platform targets complaint resolution within 24 hours; this is an operational target, not an unconditional guarantee.

---

## 27. Administrator Dashboard

The administrator can view:

### Requests

- New requests
- Pending assignments
- Assigned jobs
- Active jobs
- Completed jobs
- Cancelled jobs
- No-worker-available cases

### Worker database

- Worker profile
- Skills
- Certifications
- Cooperative relationship
- Jobs completed
- Requests received
- Requests accepted
- Requests rejected
- Cancellations
- Ratings
- Complaints
- Performance score

### Job monitoring

- Consumer need
- Work category
- Before image where applicable
- After image where applicable
- Job status
- Complaints
- Reports

### Complaint management

- Open complaints
- Worker response
- Investigation
- Resolution
- Refund decision

---

## 28. Worker Welfare

The MVP stores basic welfare/insurance status information and makes it visible to authorized administrators.

It does not implement a complete insurance claims or benefits-management system.

---

## 29. Notifications

### Consumer

- Request submitted
- Worker assigned
- Worker accepted
- Worker changed
- Schedule updates
- Service completion
- Payment status
- Invoice
- Complaint updates

### Worker

- New assignment
- Job details
- Schedule
- Cancellation
- Reassignment
- Complaint
- Payment/earnings status

### Administrator

- New request
- Worker rejection
- Worker cancellation
- Complaint
- No-worker-available case
- Verification events

---

## 30. Privacy

Sensitive data may include:

- Identity documents
- Certification documents
- Payment information
- Phone number
- Address
- Service location

Use data minimization and role-based access.

Consumers should not receive worker identity documents, Aadhaar numbers, payment identifiers, or internal cooperative records.

---

## 31. Low-Internet Support

The MVP is low-bandwidth optimized and offline-assisted, not fully offline.

Techniques:

- Image compression
- Lightweight UI
- Small API payloads
- Pagination
- Local caching
- Retry mechanisms
- Cached job details
- Synchronization after connectivity returns

---

## 32. MVP Success Metrics

- Request-to-assignment time
- Worker acceptance rate
- Job completion rate
- Worker cancellation rate
- Consumer cancellation rate
- Average rating
- Complaint rate
- Complaint resolution time
- Active verified workers
- Jobs generated for cooperative workers
- Worker utilization

---

## 33. Future Scope

- AI-based demand forecasting
- AI-assisted workforce allocation
- Emergency/on-demand services
- Live location tracking
- Advanced route optimization
- Full insurance integration
- Advanced welfare management
- Institutional customers
- Cross-federation worker sharing
- Advanced analytics
- Fully offline operation
- Automated settlement engine
