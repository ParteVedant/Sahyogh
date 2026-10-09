const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://bfnvobksryepuykvhcqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbnZvYmtzcnllcHV5a3ZoY3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDY0NjcsImV4cCI6MjEwMzQ4MjQ2N30.Bhjx_iwJDvsttLo7rE1YSzE8iYyIbr4Sk1dTVlLviNc'
);

async function main() {
  // Test if profiles table exists by trying to select from it
  const { error: testError } = await supabase.from('profiles').select('id').limit(1);
  
  if (!testError) {
    console.log('Profiles table already exists. Done.');
    return;
  }
  
  if (testError && testError.code === '42P01') {
    console.log('Profiles table does not exist. Please create it manually in Supabase SQL editor.');
    console.log('Run this SQL in Supabase Dashboard > SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer','coordinator','worker')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow public read for service requests (coordinator/worker can read all profiles)
CREATE POLICY "Service read for all authenticated"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');
    `);
  } else {
    console.log('Error checking profiles table:', testError.message);
  }
}

main().catch(console.error);
