"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { signOutUser } from "@/lib/supabase/auth";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ShieldCheck, LogOut, UserCheck, User, HardHat } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, currentUser } = useAppStore();

  const isConsumer = pathname.startsWith("/consumer");
  const isAdmin = pathname.startsWith("/admin");
  const isWorker = pathname.startsWith("/worker");
  const isPortal = isConsumer || isAdmin || isWorker;

  const handleLogout = async () => {
    await signOutUser(); // Sign out from Supabase
    logout();            // Clear Zustand state
    router.push("/");
  };

  const getProfileLink = () => {
    if (isConsumer) return "/consumer/profile";
    if (isAdmin) return "/admin/profile";
    if (isWorker) return "/worker/profile";
    return "/auth/role-select";
  };

  // Display name: use real user name from Supabase auth, or a portal fallback
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const displayName = (mounted && currentUser?.fullName) || (
    isConsumer ? "My Account" : isAdmin ? "Coordinator" : "Worker"
  );

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.webp"
            alt="Sahyog Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Sahyog
              </span>
              <span className="bg-accent/20 text-accent font-bold px-2 py-0.5 rounded text-xs">
                सहयोग
              </span>
            </div>
            <span className="text-[10px] text-gray-300 tracking-wider block font-medium">
              Cooperative Gig Services
            </span>
          </div>
        </Link>

        {/* Dynamic Content: Public Nav vs Role Portal Session Header */}
        {!isPortal ? (
          /* Public Landing Navbar Links */
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-200">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <a href="#about" className="hover:text-accent transition-colors">About Us</a>
              <a href="#how-it-works" className="hover:text-accent transition-colors">How It Works</a>
              <a href="#services" className="hover:text-accent transition-colors">Services</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </nav>

            <LanguageSelector />

            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          /* Active Portal Session Header with My Profile & Log Out */
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <LanguageSelector />

            <Link
              href={getProfileLink()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
              suppressHydrationWarning
            >
              {isConsumer && <User className="w-4 h-4 text-emerald-400" />}
              {isAdmin && <UserCheck className="w-4 h-4 text-accent" />}
              {isWorker && <HardHat className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline max-w-[120px] truncate" suppressHydrationWarning>{displayName}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Profile</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 active:scale-95 border border-red-400/30 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
