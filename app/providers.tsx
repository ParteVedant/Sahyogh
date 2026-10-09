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

    // 5. Cross-tab & local store sync listener with BroadcastChannel
    const handleStoreUpdate = () => {
      try {
        const savedRequests = localStorage.getItem("sahyog_requests");
        if (savedRequests) {
          const parsed = JSON.parse(savedRequests);
          if (Array.isArray(parsed) && parsed.length > 0) {
            useAppStore.setState((state) => {
              const map = new Map<string, any>();
              parsed.forEach((r) => map.set(r.id, r));
              state.requests.forEach((r) => {
                if (!map.has(r.id)) map.set(r.id, r);
              });
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.id.localeCompare(a.id)
              );
              return { requests: merged };
            });
          }
        }
      } catch (e) {}
    };

    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("sahyog_realtime_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "SYNC_STORE") {
          handleStoreUpdate();
          initSupabaseData();
        }
      };
    }

    window.addEventListener("sahyog_store_update", handleStoreUpdate);
    window.addEventListener("storage", handleStoreUpdate);

    // 6. Periodic polling fallback every 3 seconds for guaranteed real-time UI monitoring
    const pollInterval = setInterval(() => {
      initSupabaseData();
      handleStoreUpdate();
    }, 3000);

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(realtimeChannel);
      if (bc) bc.close();
      window.removeEventListener("sahyog_store_update", handleStoreUpdate);
      window.removeEventListener("storage", handleStoreUpdate);
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
