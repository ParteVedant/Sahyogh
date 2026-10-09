import { supabase } from "./client";

// ─── Types ─────────────────────────────────────────────────────────────────

export type UserRole = "consumer" | "coordinator" | "worker";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
}

// ─── Sign Up ───────────────────────────────────────────────────────────────

/**
 * Register a new user with email + password and store extra info in profiles table.
 * The trigger `handle_new_user` will auto-create the profiles row from user_metadata.
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: UserRole
): Promise<{ user: UserProfile | null; error: string | null }> {
  try {
    // 1. Create auth account with metadata so the DB trigger can pick it up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: "Signup failed — no user returned." };

    // 2. If trigger hasn't fired yet, manually upsert the profile row
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      phone,
      role,
    });

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName,
        phone,
        role,
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown signup error";
    return { user: null, error: message };
  }
}

// ─── Sign In ───────────────────────────────────────────────────────────────

/**
 * Sign in with email + password. Returns user profile including role.
 */
export async function signInUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: "Login failed — no user returned." };

    // Fetch the profile row to get role, fullName, phone
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      // Fallback: read from user_metadata if profiles row missing
      const meta = data.user.user_metadata || {};
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          fullName: meta.full_name || email.split("@")[0],
          phone: meta.phone || "",
          role: (meta.role as UserRole) || "consumer",
        },
        error: null,
      };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: profile.full_name || email.split("@")[0],
        phone: profile.phone || "",
        role: profile.role as UserRole,
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown login error";
    return { user: null, error: message };
  }
}

// ─── Sign Out ──────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── Get current session's profile ────────────────────────────────────────

export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profile) {
      const meta = session.user.user_metadata || {};
      return {
        id: session.user.id,
        email: session.user.email!,
        fullName: meta.full_name || session.user.email!.split("@")[0],
        phone: meta.phone || "",
        role: (meta.role as UserRole) || "consumer",
      };
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      fullName: profile.full_name,
      phone: profile.phone || "",
      role: profile.role as UserRole,
    };
  } catch {
    return null;
  }
}
