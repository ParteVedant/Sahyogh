import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bfnvobksryepuykvhcqo.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbnZvYmtzcnllcHV5a3ZoY3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDY0NjcsImV4cCI6MjEwMzQ4MjQ2N30.Bhjx_iwJDvsttLo7rE1YSzE8iYyIbr4Sk1dTVlLviNc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
