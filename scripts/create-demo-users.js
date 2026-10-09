const SUPABASE_URL = "https://bfnvobksryepuykvhcqo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbnZvYmtzcnllcHV5a3ZoY3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDY0NjcsImV4cCI6MjEwMzQ4MjQ2N30.Bhjx_iwJDvsttLo7rE1YSzE8iYyIbr4Sk1dTVlLviNc";

const demoUsers = [
  {
    email: "consumer@sahyog.com",
    password: "Password123!",
    role: "consumer",
    fullName: "Rahul Sharma",
    phone: "+91 98199 88776",
  },
  {
    email: "coordinator@sahyog.com",
    password: "Password123!",
    role: "coordinator",
    fullName: "Setu Coordinator",
    phone: "+91 98200 11223",
  },
  {
    email: "worker@sahyog.com",
    password: "Password123!",
    role: "worker",
    fullName: "Suresh Kumar",
    phone: "+91 98201 45231",
  },
];

async function createUsers() {
  for (const user of demoUsers) {
    console.log(`Creating demo user: ${user.email} (${user.role})...`);
    
    // 1. Sign up user in Supabase Auth
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        data: {
          full_name: user.fullName,
          phone: user.phone,
          role: user.role,
        },
      }),
    });

    const authData = await authRes.json();
    
    if (authRes.ok && authData.user) {
      console.log(`✓ Auth Account Created: ${user.email} (ID: ${authData.user.id})`);
      
      // 2. Also ensure row exists in profiles table
      const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: authData.user.id,
          full_name: user.fullName,
          phone: user.phone,
          role: user.role,
        }),
      });

      if (profileRes.ok) {
        console.log(`✓ Profile row linked in DB for ${user.email}`);
      } else {
        console.log(`Note: Profile row insert response: ${profileRes.status}`);
      }
    } else {
      console.log(`Notice for ${user.email}:`, authData.msg || authData.error_description || JSON.stringify(authData));
    }
  }
}

createUsers();
