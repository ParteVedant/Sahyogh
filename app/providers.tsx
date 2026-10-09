"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store/use-app-store";
import { supabase } from "@/lib/supabase/client";
import { getCurrentProfile } from "@/lib/supabase/auth";

function DataInitializer({ children }: { children: React.ReactNode }) {
  const { initSupabaseData, setCurrentUser, clearCurrentUser } = useAppStore();

  useEffect(() => {
    // 1. Restore session from localStorage or Supabase on every page load
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("sahyog_current_user");
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
          }
        } catch (e) {}
      }
    }

    getCurrentProfile().then((profile) => {
      if (profile) {
        setCurrentUser(profile);
      }
    });

    // 2. Listen to Supabase auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await getCurrentProfile();
        if (profile) setCurrentUser(profile);
      } else if (event === "SIGNED_OUT") {
        clearCurrentUser();
      }
    });

    // 3. Fetch live Supabase data on app start
    initSupabaseData();

    // 4. Realtime subscription to live database updates across all 3 portals
    const realtimeChannel = supabase
      .channel("public-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "service_requests" },
        () => {
          initSupabaseData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workers" },
        () => {
          initSupabaseData();
        }
      )
      .subscribe();

    // 5. Periodic polling fallback every 3 seconds for guaranteed real-time UI monitoring
    const pollInterval = setInterval(() => {
      initSupabaseData();
    }, 3000);

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(realtimeChannel);
      clearInterval(pollInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DataInitializer>{children}</DataInitializer>
    </QueryClientProvider>
  );
}
