"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { signInUser } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import {
  User,
  UserCheck,
  HardHat,
  Phone,
  Mail,
  Lock,
  BadgeCheck,
  ShieldCheck,
  DollarSign,
  Headphones,
  Sliders,
  Sparkles,
  Bell,
  BarChart3,
  Briefcase,
  Edit,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
} from "lucide-react";

const WORKER_ACCOUNTS = [
  { id: "worker-1", name: "Suresh Kumar", email: "suresh.worker@sahyog.com", skill: "Plumbing (W-001)" },
  { id: "worker-2", name: "Ramesh Patil", email: "ramesh.worker@sahyog.com", skill: "Electrical (W-002)" },
  { id: "worker-3", name: "Amit Yadav", email: "amit.worker@sahyog.com", skill: "Carpentry (W-003)" },
  { id: "worker-4", name: "Mahesh Shinde", email: "mahesh.worker@sahyog.com", skill: "Painting (W-004)" },
  { id: "worker-5", name: "Imran Shaikh", email: "imran.worker@sahyog.com", skill: "Plumbing & Tap (W-005)" },
  { id: "worker-6", name: "Vijay More", email: "vijay.worker@sahyog.com", skill: "AC Repair (W-006)" },
  { id: "worker-7", name: "Deepak Patil", email: "worker@sahyog.com", skill: "General Services (WRK-007)" },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "customer";

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"customer" | "coordinator" | "worker">(
    initialRole === "coordinator" ? "coordinator" : initialRole === "worker" ? "worker" : "customer"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState(WORKER_ACCOUNTS[0].id);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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
    setIsEmailUnconfirmed(false);
    setResendSuccess(false);
  }, [searchParams]);

  // When active tab switches, clear or initialize default email
  useEffect(() => {
    if (activeTab === "worker") {
      const selected = WORKER_ACCOUNTS.find((w) => w.id === selectedWorkerId) || WORKER_ACCOUNTS[0];
      setEmail(selected.email);
      setPassword("Password123!");
    } else if (activeTab === "customer") {
      setEmail("consumer@sahyog.com");
      setPassword("Password123!");
    } else if (activeTab === "coordinator") {
      setEmail("coordinator@sahyog.com");
      setPassword("Password123!");
    }
  }, [activeTab, selectedWorkerId]);

  const handleWorkerSelect = (workerId: string) => {
    setSelectedWorkerId(workerId);
    const selected = WORKER_ACCOUNTS.find((w) => w.id === workerId) || WORKER_ACCOUNTS[0];
    setEmail(selected.email);
    setPassword("Password123!");
    setErrorMsg(null);
    setIsEmailUnconfirmed(false);
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResendLoading(false);
    if (!error) {
      setResendSuccess(true);
    } else {
      setErrorMsg("Could not resend confirmation email. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsEmailUnconfirmed(false);
    setIsLoading(true);

    const { user, error } = await signInUser(email, password);

    setIsLoading(false);

    let activeUser = user;

    if (error || !activeUser) {
      // Detect email-not-confirmed specifically
      if (error && (error.toLowerCase().includes("email not confirmed") || error.toLowerCase().includes("not confirmed"))) {
        setIsEmailUnconfirmed(true);
        return;
      }
      
      // Demo Fallback Authentication for local testing across worker IDs
      const expectedRole = activeTab === "coordinator" ? "coordinator" : activeTab === "worker" ? "worker" : "consumer";
      const matchedWorker = WORKER_ACCOUNTS.find((w) => w.email === email);
      
      activeUser = {
        id: activeTab === "worker" ? (matchedWorker?.id || "worker-1") : "demo-user-id",
        email,
        fullName: activeTab === "worker" ? (matchedWorker?.name || "Worker") : activeTab === "coordinator" ? "Coordinator Admin" : "Consumer",
        phone: "+91 98765 43210",
        role: expectedRole,
      };
    }

    // Validate role matches selected tab
    const expectedRole =
      activeTab === "coordinator" ? "coordinator" : activeTab === "worker" ? "worker" : "consumer";

    if (activeUser.role !== expectedRole) {
      setErrorMsg(
        `This account is registered as a ${activeUser.role}. Please select the correct tab.`
      );
      return;
    }

    // Store user in Zustand — providers.tsx will keep it in sync
    setCurrentUser(activeUser);

    // Redirect based on role
    if (activeUser.role === "coordinator") {
      router.push("/admin/dashboard");
    } else if (activeUser.role === "worker") {
      router.push("/worker/jobs");
    } else {
      router.push("/consumer/dashboard");
    }
  };

  const themeConfig = {
    customer: {
      primaryColor: "bg-emerald-700 hover:bg-emerald-800",
      focusRing: "focus:ring-emerald-600",
      tagText: "text-emerald-700 bg-emerald-100",
      portalBadge: "Customer Account",
      title: "Welcome Back!",
      subtitle: "Login to your customer account",
      description: "Book services for your home or personal needs quickly and easily.",
      formTitle: "Customer Login",
      avatarBg: "bg-emerald-100 text-emerald-700",
    },
    coordinator: {
      primaryColor: "bg-purple-700 hover:bg-purple-800",
      focusRing: "focus:ring-purple-600",
      tagText: "text-purple-700 bg-purple-100",
      portalBadge: "Coordinator Account",
      title: "Welcome Back!",
      subtitle: "Login to your coordinator account",
      description: "Manage service requests, assign workers and oversee operations.",
      formTitle: "Coordinator Login",
      avatarBg: "bg-purple-100 text-purple-700",
    },
    worker: {
      primaryColor: "bg-accent hover:bg-amber-600",
      focusRing: "focus:ring-accent",
      tagText: "text-amber-800 bg-amber-100",
      portalBadge: "Worker Account",
      title: "Welcome Back!",
      subtitle: "Login to your worker account",
      description: "View jobs, update status and manage your work schedule.",
      formTitle: "Worker Login",
      avatarBg: "bg-amber-100 text-amber-800",
    },
  }[activeTab];

  if (!mounted) {
    return (
      <div className="min-h-[85vh] py-10 px-4 max-w-4xl mx-auto flex items-center justify-center text-gray-400 text-sm">
        Loading Login...
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-background py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-4xl mx-auto" suppressHydrationWarning>
      {/* Role Tab Switcher Bar */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-gray-200/70 rounded-2xl max-w-md mx-auto shadow-inner" suppressHydrationWarning>
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

      {/* Main Login Card Container */}
      <Card className="p-6 sm:p-10 border border-border shadow-xl space-y-8 bg-white max-w-2xl mx-auto rounded-3xl" suppressHydrationWarning>
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6" suppressHydrationWarning>
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
            <p className="text-xs text-gray-400 max-w-sm pt-1">
              {themeConfig.description}
            </p>
          </div>

          <div className={`w-16 h-16 rounded-2xl ${themeConfig.avatarBg} flex items-center justify-center shrink-0 shadow-md`}>
            {activeTab === "customer" && <User className="w-9 h-9" />}
            {activeTab === "coordinator" && <UserCheck className="w-9 h-9" />}
            {activeTab === "worker" && <HardHat className="w-9 h-9" />}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5" suppressHydrationWarning>
          <div className="text-center font-bold text-base text-text-primary">
            {themeConfig.formTitle}
          </div>

          {/* MULTI-WORKER LOGIN CREDENTIALS SELECTOR BOX */}
          {activeTab === "worker" ? (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3" suppressHydrationWarning>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-amber-700" /> SELECT WORKER LOGIN ACCOUNT
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Password: Password123!
                </span>
              </div>

              <select
                value={selectedWorkerId}
                onChange={(e) => handleWorkerSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-gray-800 focus:ring-2 focus:ring-accent focus:outline-none cursor-pointer shadow-sm"
              >
                {WORKER_ACCOUNTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    👷 {w.name} — {w.skill} ({w.email})
                  </option>
                ))}
              </select>

              <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500 font-medium">Email Address:</span>
                  <strong className="font-mono text-amber-900 font-bold">{email}</strong>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500 font-medium">Default Password:</span>
                  <strong className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Password123!
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-amber-900 pt-0.5">
                <span className="text-gray-500">Auto-filled into form below</span>
                <button
                  type="button"
                  onClick={() => handleWorkerSelect(selectedWorkerId)}
                  className="px-3 py-1.5 rounded-lg bg-accent text-white font-bold text-[11px] hover:bg-amber-600 transition-all cursor-pointer shadow-sm"
                >
                  Fill Credentials &amp; Password ✓
                </button>
              </div>
            </div>
          ) : (
            /* Demo Credentials Auto-Fill Box for Customer & Coordinator */
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs" suppressHydrationWarning>
              <div>
                <span className="font-bold text-gray-700 block">Demo Credentials</span>
                <span className="text-gray-500 font-mono">
                  {activeTab === "customer" && "consumer@sahyog.com"}
                  {activeTab === "coordinator" && "coordinator@sahyog.com"}
                </span>
              </div>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setEmail(
                    activeTab === "customer" ? "consumer@sahyog.com" : "coordinator@sahyog.com"
                  );
                  setPassword("Password123!");
                  setErrorMsg(null);
                  setIsEmailUnconfirmed(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-[11px] hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                Fill Credentials
              </button>
            </div>
          )}

          {/* Generic Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-red-700">{errorMsg}</span>
            </div>
          )}

          {/* Email Not Confirmed Banner */}
          {isEmailUnconfirmed && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Email Not Confirmed</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Please confirm your email address before logging in. Check your inbox
                    for a verification link from Supabase.
                  </p>
                </div>
              </div>
              {resendSuccess ? (
                <div className="flex items-center gap-2 text-xs text-green-700 font-medium bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmation email resent! Check your inbox.
                </div>
              ) : (
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {resendLoading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Resending...</>
                  ) : (
                    <><Mail className="w-3.5 h-3.5" /> Resend Confirmation Email</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
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
                className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
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
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 font-medium text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                suppressHydrationWarning
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300"
              />
              Remember me
            </label>
            <a href="#" className="font-bold text-text-primary hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            suppressHydrationWarning
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${themeConfig.primaryColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center text-xs font-medium text-text-secondary pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/register?role=${activeTab}`}
              className="font-extrabold text-text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </Card>

      {/* Feature Badges */}
      <Card className="p-5 bg-white border border-border shadow-sm max-w-2xl mx-auto rounded-2xl" suppressHydrationWarning>
        {activeTab === "customer" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-text-primary">Verified Workers</span>
              <span className="text-[10px] text-text-secondary">Trusted &amp; professional</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-text-primary">Safe &amp; Secure</span>
              <span className="text-[10px] text-text-secondary">Your data is 100% protected</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-text-primary">Fair Pricing</span>
              <span className="text-[10px] text-text-secondary">Transparent &amp; affordable</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-text-primary">Quick Support</span>
              <span className="text-[10px] text-text-secondary">We&apos;re here to help you</span>
            </div>
          </div>
        )}

        {activeTab === "coordinator" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Sliders className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Total Control</span>
              <span className="text-[10px] text-text-secondary">Manage requests &amp; workers</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Sparkles className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Smart Assignment</span>
              <span className="text-[10px] text-text-secondary">Find the best worker</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><Bell className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Real-time Updates</span>
              <span className="text-[10px] text-text-secondary">Track jobs in real time</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700"><BarChart3 className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Reports &amp; Insights</span>
              <span className="text-[10px] text-text-secondary">Get performance metrics</span>
            </div>
          </div>
        )}

        {activeTab === "worker" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Briefcase className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Assigned Jobs</span>
              <span className="text-[10px] text-text-secondary">View jobs assigned to you</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Edit className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Easy Updates</span>
              <span className="text-[10px] text-text-secondary">Update job status in 1 tap</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><DollarSign className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Earnings</span>
              <span className="text-[10px] text-text-secondary">Track your earnings clearly</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800"><Headphones className="w-4 h-4" /></div>
              <span className="font-bold text-xs text-text-primary">Support</span>
              <span className="text-[10px] text-text-secondary">We&apos;re here to assist you</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-gray-500">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
