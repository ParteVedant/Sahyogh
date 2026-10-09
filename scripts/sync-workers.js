const SUPABASE_URL = "https://bfnvobksryepuykvhcqo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbnZvYmtzcnllcHV5a3ZoY3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDY0NjcsImV4cCI6MjEwMzQ4MjQ2N30.Bhjx_iwJDvsttLo7rE1YSzE8iYyIbr4Sk1dTVlLviNc";

const workers = [
  {
    id: "worker-1",
    worker_code: "W-001",
    name: "Suresh Kumar",
    phone: "+91 98201 45231",
    society_name: "Shivaji Labour Cooperative Society",
    rating: 4.8,
    jobs_completed: 45,
    skills: ["Plumbing", "Pipe Fitting"],
    service_areas: ["Thane", "Kalwa"],
    status: "AVAILABLE",
    available_now: true,
  },
  {
    id: "worker-2",
    worker_code: "W-002",
    name: "Ramesh Patil",
    phone: "+91 97654 31872",
    society_name: "Thane Skilled Workers Cooperative",
    rating: 4.6,
    jobs_completed: 38,
    skills: ["Electrical", "Wiring", "Fan Repair"],
    service_areas: ["Thane", "Majiwada"],
    status: "BUSY",
    available_now: false,
  },
  {
    id: "worker-3",
    worker_code: "W-003",
    name: "Amit Yadav",
    phone: "+91 98765 21430",
    society_name: "Maharashtra Service Workers Society",
    rating: 4.7,
    jobs_completed: 52,
    skills: ["Carpentry", "Furniture Repair"],
    service_areas: ["Kalwa", "Mumbra"],
    status: "AVAILABLE",
    available_now: true,
  },
  {
    id: "worker-4",
    worker_code: "W-004",
    name: "Mahesh Shinde",
    phone: "+91 98192 67345",
    society_name: "Shivaji Labour Cooperative Society",
    rating: 4.5,
    jobs_completed: 29,
    skills: ["Painting", "Wall Repair"],
    service_areas: ["Thane", "Wagle Estate"],
    status: "AVAILABLE",
    available_now: true,
  },
  {
    id: "worker-5",
    worker_code: "W-005",
    name: "Imran Shaikh",
    phone: "+91 99876 54123",
    society_name: "Thane General Workers Cooperative",
    rating: 4.9,
    jobs_completed: 64,
    skills: ["Plumbing", "Drain Unclogging", "Tap Fitting"],
    service_areas: ["Thane", "Kalher", "Bhiwandi"],
    status: "BUSY",
    available_now: false,
  },
  {
    id: "worker-6",
    worker_code: "W-006",
    name: "Vijay More",
    phone: "+91 97021 86452",
    society_name: "Maharashtra Skilled Labour Society",
    rating: 4.4,
    jobs_completed: 22,
    skills: ["AC Repair", "Appliance Repair"],
    service_areas: ["Thane", "Kopri", "Naupada"],
    status: "AVAILABLE",
    available_now: true,
  },
];

async function sync() {
  console.log("Upserting 6 workers to Supabase...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/workers`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(workers),
  });

  if (res.ok) {
    console.log("SUCCESS: 6 workers updated in Supabase database!");
  } else {
    const errText = await res.text();
    console.error("ERROR syncing workers:", errText);
  }
}

sync();
