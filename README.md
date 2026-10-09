# Sahyog (सहयोग) — Cooperative Gig Services Platform & Setu Ops Console

A cooperative-owned digital service marketplace connecting households and communities with verified skilled workers from Labour Cooperative Societies and Federations.

---

## 🌟 Core Concept & Vision

Unlike conventional private gig marketplaces that auto-dispatch workers, **Sahyog (सहयोग)** keeps the **Cooperative Administrator / Coordinator** at the center of workforce allocation:

```text
Consumer Service Request
        ↓
Digital Platform (Sahyog)
        ↓
Cooperative Administrator (Setu Ops Console)
        ↓
Verified Cooperative Worker
```

The platform digitizes service discovery, request management, smart worker allocation with explainable match scores, active job execution, digital payments, invoicing, ratings, and worker welfare records.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (`strict` mode throughout)
- **Styling**: Tailwind CSS (extended custom design tokens)
- **State Management**: Zustand (in-memory interactive store for live multi-role demo synchronization)
- **Data Fetching**: TanStack Query (React Query v5)
- **Icons**: Lucide React
- **Typography**: Inter + Noto Sans Devanagari (for bilingual branding `"Sahyog सहयोग"`)

---

## 🎨 Design System & Color Palette

- **Primary**: `#173F5F` (Navy / Dark Green Header, Sidebar Console, Nav)
- **Accent**: `#F6A623` (Warm Amber CTAs, Stars, Recommendation rings, Badges)
- **Secondary**: `#20639B` (Active menu highlights, Links, Info banners)
- **Background**: `#F5F7FA` (App background)
- **Surface**: `#FFFFFF` (Cards, Modals, Tables)
- **Border**: `#DDE3EA` (Card borders & dividers)

---

## 📱 Three Role Portals

### 1. Consumer Portal (`/consumer/*`)
- **Dashboard (`/consumer/dashboard`)**: Hero card, 4-step "How It Works" guide, 8 Service Categories (*Plumbing, Electrical, Carpentry, Painting, Deep Cleaning, Gardening, Driver on Demand, Appliance Repair*).
- **Service Selection (`/consumer/browse`)**: Selectable 2-column service grid displaying sub-services in accent orange.
- **Request Booking (`/consumer/new-request`)**: Form with category summary, problem description, native date & time slot selector, address fields, and **conditional photo upload** preview.
- **Request Tracking (`/consumer/track/[id]`)**: Live vertical timeline tracking status from `REQUESTED` → `COMPLETED`, requirement details, and assigned worker card (*Verified badge, Society name, Rating*).
- **Payment Gateway Simulator (`/consumer/pay/[id]`)**: Order summary breakdown (Base fare, Service fee, 18% GST), UPI/Card payment options, sandbox mode banner, and Razorpay checkout simulator.
- **Rating & Review (`/consumer/rate/[id]`)**: Interactive 5-star selector, written review, and issue checkboxes (*Late arrival, Behavior, Overcharging*).

### 2. Setu Cooperative Ops Console (`/admin/*`)
- **Ops Dashboard (`/admin/dashboard`)**: 6 KPI stat cards (*New requests*, *Active jobs*, *Available workers*, *Completed today*, *Workers busy*, *Pending assignments*), New Requests queue, and Workforce Status progress bar widget (*Available*, *Busy*, *Offline*).
- **Service Requests Queue (`/admin/requests`)**: Real-time filtering by status pills (*All*, *New*, *Matching*, *Awaiting Approval*, *Assigned*), search bar, service dropdown, and area dropdown.
- **Request Details (`/admin/requests/[id]`)**: Request metadata, urgency badge, customer info (*Rahul Sharma*), attachment thumbnail, *"Find Suitable Workers →"* CTA, and request timeline.
- **Smart Worker Allocation (`/admin/requests/[id]/allocate`)**: Matching Engine V2 top bar, `★ SYSTEM RECOMMENDATION` card for Suresh Kumar (Plumbing Specialist, 6 yrs exp), circular Match Score ring (`91% MATCH SCORE`), match criteria checklist, interactive **Match Explanation Modal** (5-part point breakdown), and ranked list of alternative candidates.
- **Worker Directory & Management (`/admin/workers`)**: Real-time searchable worker directory with skill/status/area filters, status pills (*Available*, *Busy*, *Offline*), rating, jobs completed, and `"+ Add Worker"` button.
- **Worker Profile (`/admin/workers/[id]`)**: Detailed profile with verified badge, primary skill, experience, service areas, certifications, workload progress bars, and job stats.
- **Add Worker (`/admin/workers/new`)**: Worker registration form with skill tags, sub-skill tags, service area tags, and certification document uploader.
- **Jobs Management & Tracking (`/admin/jobs` & `/admin/jobs/[id]`)**: Job status filter tabs (*All*, *Assigned*, *Accepted*, *In Progress*, *Completed*), active job cards, and job tracking detail screen with real-time status stepper & `"📞 Contact Worker"` CTA button.
- **Analytics (`/admin/analytics`)**: Demand distribution, response times, and average match score insights.

### 3. Worker Portal (`/worker/*`)
- **Assigned Jobs (`/worker/jobs`)**: Worker identity header card (*Avatar, VERIFIED badge, Society association*), incoming assignment cards with **Accept Job** / **Reject** buttons, and rejection reason modal.
- **Active Job Execution (`/worker/active/[id]`)**: Full address & consumer phone number revealed upon job acceptance, **Mark as Started** trigger, completion notes textarea, photo evidence upload, and **Mark Job as Completed** CTA.
- **Job History (`/worker/history`)**: Total earnings summary (₹) and past completed job records.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js v18.x or v20.x+
- npm v9.x or v10.x+

### Setup & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 **Demo Role Switcher**: Use the **Consumer | Admin | Worker** role switcher in the top right header to instantly jump between dashboards and test live multi-role state updates!

### Build Verification
```bash
# Verify production build
npm run build

# Start production build
npm start
```

---

## 📦 Sharing with Backend Engineers

If you are sharing the codebase with backend engineers, use the lightweight ZIP archive located at:
`c:\Users\Santoshi\OneDrive\Desktop\sahyogh-frontend.zip` (Size: ~98 KB).

Do **not** zip or send the raw folder containing `node_modules` and `.next` (which total over 250 MB).

### Backend REST API Integration Guide
When connecting the frontend to a production **PostgreSQL + Prisma** backend API:

1. All TypeScript domain entities in `lib/types/index.ts` (`ServiceRequest`, `WorkerProfile`, `ServiceCategory`, `AuditLog`, `RequestStatus`) map 1-to-1 with PostgreSQL backend schemas.
2. Backend REST API routes expected:
   - `POST /api/service-requests` (Create Request)
   - `GET /api/admin/requests` (Admin Queue)
   - `POST /api/admin/requests/:id/assign` (Assign Worker)
   - `POST /api/worker/jobs/:id/accept` (Worker Accept)
   - `POST /api/payments/orders` (Razorpay Payment)
3. Swap the client Zustand store handlers in `lib/store/use-app-store.ts` with TanStack Query hooks fetching from the backend API.

---

## 📄 License & Ownership
Property of **Sahyog Labour Cooperative Federation**. Built for cooperative governance and dignified digital work.
