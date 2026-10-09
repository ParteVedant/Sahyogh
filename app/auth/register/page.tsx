"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { signUpUser } from "@/lib/supabase/auth";
import { Card } from "@/components/ui/card";
import {
  User,
  UserCheck,
  HardHat,
  Phone,
  Mail,
  Lock,
  MapPin,
  Wrench,
  ShieldCheck,
  Sliders,
  Sparkles,
  Bell,
  Calendar,
  Briefcase,
  TrendingUp,
  Headphones,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "customer";

  const [activeTab, setActiveTab] = useState<"customer" | "coordinator" | "worker">(
    initialRole === "coordinator" ? "coordinator" : initialRole === "worker" ? "worker" : "customer"
  );

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [primarySkill, setPrimarySkill] = useState("Plumbing Repairs");
  const [locationCity, setLocationCity] = useState("Thane, Maharashtra");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  const { setCurrentUser } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "coordinator") setActiveTab("coordinator");
    else if (roleParam === "worker") setActiveTab("worker");
    else if (roleParam === "customer") setActiveTab("customer");
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const role: "consumer" | "coordinator" | "worker" =
      activeTab === "coordinator" ? "coordinator" : activeTab === "worker" ? "worker" : "consumer";

    const { user, error } = await signUpUser(email, password, fullName, mobileNumber, role);

    setIsLoading(false);

    if (error || !user) {
      setErrorMsg(error || "Registration failed. Please try again.");
      return;
    }

    // Store user and redirect
    setCurrentUser(user);

    setSuccessMsg(`Account created! Welcome, ${user.fullName}. Redirecting...`);

    setTimeout(() => {
      if (role === "coordinator") router.push("/admin/dashboard");
      else if (role === "worker") router.push("/worker/jobs");
      else router.push("/consumer/dashboard");
    }, 1500);
  };

  const themeConfig = {
    customer: {
      primaryColor: "bg-emerald-700 hover:bg-emerald-800",
      focusRing: "focus:ring-emerald-600",
      tagText: "text-emerald-700 bg-emerald-100",
      portalBadge: "Customer Registration",
      title: "Customer Sign Up",
      subtitle: "Create your account to book services",
      avatarBg: "bg-emerald-100 text-emerald-700",
    },
    coordinator: {
      primaryColor: "bg-purple-700 hover:bg-purple-800",
      focusRing: "focus:ring-purple-600",
      tagText: "text-purple-700 bg-purple-100",
      portalBadge: "Coordinator Registration",
      title: "Coordinator Sign Up",
      subtitle: "Manage requests and coordinate service operations",
      avatarBg: "bg-purple-100 text-purple-700",
    },
    worker: {
      primaryColor: "bg-accent hover:bg-amber-600",
      focusRing: "focus:ring-accent",
      tagText: "text-amber-800 bg-amber-100",
      portalBadge: "Worker Registration",
      title: "Worker Sign Up",
      subtitle: "Join as a service professional and get work",
      avatarBg: "bg-amber-100 text-amber-800",
    },
  }[activeTab];

  if (!mounted) {
    return (
      <div className="min-h-[85vh] py-10 px-4 max-w-4xl mx-auto flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-background py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-4xl mx-auto" suppressHydrationWarning>
      {/* Role Tab Switcher Bar */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-gray-200/70 rounded-2xl max-w-md mx-auto shadow-inner">
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => { setActiveTab("customer"); setErrorMsg(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "customer"
              ? "bg-white text-emerald-800 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <User className="w-3.5 h-3.5" /> Customer
        </button>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => { setActiveTab("coordinator"); setErrorMsg(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "coordinator"
              ? "bg-white text-purple-800 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Coordinator
        </button>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => { setActiveTab("worker"); setErrorMsg(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "worker"
              ? "bg-white text-amber-800 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <HardHat className="w-3.5 h-3.5" /> Worker
        </button>
      </div>

      {/* Main Registration Card */}
      <Card className="p-6 sm:p-10 border border-border shadow-xl space-y-8 bg-white max-w-2xl mx-auto rounded-3xl" suppressHydrationWarning>
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${themeConfig.tagText}`}>
              {themeConfig.portalBadge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {themeConfig.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              {themeConfig.subtitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-secondary">Already have an account? </span>
            <Link href={`/auth/login?role=${activeTab}`} className="text-xs font-extrabold text-text-primary hover:underline">
              Login
            </Link>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4" suppressHydrationWarning>

          {/* Error/Success Banners */}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-red-700">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-green-700">{successMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                suppressHydrationWarning
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                suppressHydrationWarning
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Worker-specific: Primary Skill */}
          {activeTab === "worker" && (
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Primary Skill *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <select
                  suppressHydrationWarning
                  value={primarySkill}
                  onChange={(e) => setPrimarySkill(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing} bg-white`}
                >
                  <option>Plumbing Repairs</option>
                  <option>Electrical Wiring &amp; Appliances</option>
                  <option>Deep House Cleaning</option>
                  <option>Wall Painting &amp; Touch-up</option>
                  <option>Furniture Repair &amp; Carpentry</option>
                </select>
              </div>
            </div>
          )}

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              City / Area *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Thane, Maharashtra"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                suppressHydrationWarning
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                suppressHydrationWarning
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              suppressHydrationWarning
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300"
            />
            <span className="text-xs text-text-secondary">
              I agree to the{" "}
              <a href="#" className="font-bold text-text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-bold text-text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            suppressHydrationWarning
            disabled={isLoading || !agreedTerms}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${themeConfig.primaryColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Info Cards */}
      <Card className="p-5 bg-white border border-border shadow-sm max-w-2xl mx-auto rounded-2xl">
        {activeTab === "customer" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Secure Sign Up</span>
              <span className="text-[10px] text-text-secondary">Your info is safe with us</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><Calendar className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Flexible Booking</span>
              <span className="text-[10px] text-text-secondary">Choose your schedule</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><Sparkles className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Vetted Workers</span>
              <span className="text-[10px] text-text-secondary">Trained &amp; background checked</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><Headphones className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">24/7 Support</span>
              <span className="text-[10px] text-text-secondary">Always here to help</span>
            </div>
          </div>
        )}
        {activeTab === "coordinator" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Sliders className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Full Dashboard</span>
              <span className="text-[10px] text-text-secondary">Manage everything in one place</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Bell className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Live Updates</span>
              <span className="text-[10px] text-text-secondary">Real-time request alerts</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Sparkles className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Smart Matching</span>
              <span className="text-[10px] text-text-secondary">AI-powered worker ranking</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><TrendingUp className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Analytics</span>
              <span className="text-[10px] text-text-secondary">Track cooperative performance</span>
            </div>
          </div>
        )}
        {activeTab === "worker" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Briefcase className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Steady Work</span>
              <span className="text-[10px] text-text-secondary">Consistent job assignments</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><TrendingUp className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Grow Income</span>
              <span className="text-[10px] text-text-secondary">More jobs = more earnings</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Wrench className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Skill Match</span>
              <span className="text-[10px] text-text-secondary">Jobs matched to your skills</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Headphones className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Support</span>
              <span className="text-[10px] text-text-secondary">We&apos;re always with you</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-gray-500">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
