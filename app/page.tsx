"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Award,
  Users,
  Lock,
  ArrowRight,
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Hammer,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartHandshake,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMessage) return;
    setContactSubmitted(true);
  };

  const services = [
    {
      name: "Plumbing Repairs",
      hindiName: "नल-प्लंबिंग सेवा",
      icon: Wrench,
      desc: "Fix leaks, pipe installations, bathroom fitting repairs, and drainage unclogging by certified plumbers.",
    },
    {
      name: "Electrical Wiring",
      hindiName: "बिजली और उपकरण",
      icon: Zap,
      desc: "Circuit breaker fixes, ceiling fan installation, short circuit diagnosis, and safety inspections.",
    },
    {
      name: "Deep House Cleaning",
      hindiName: "घर की गहरी सफाई",
      icon: Sparkles,
      desc: "Full house deep cleaning, bathroom sanitation, kitchen degreasing, and sofa shampooing.",
    },
    {
      name: "Wall Painting",
      hindiName: "दीवार पुताई व पेंट",
      icon: Paintbrush,
      desc: "Interior wall touch-ups, waterproof coating, dampness treatment, and full room painting.",
    },
    {
      name: "Carpentry Services",
      hindiName: "बढ़ईगीरी व फर्नीचर",
      icon: Hammer,
      desc: "Door hinge alignment, cabinet repairs, custom wood fitting, and lock installations.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section matching Image 2 */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-background pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {/* Hero Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide">
              <span>Cooperative · Trusted · Together</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Sahyog <br />
              <span className="text-emerald-700">Local Services.</span> <br />
              Stronger Communities.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-text-secondary leading-relaxed max-w-lg">
              Sahyog connects you with verified local workers through cooperative societies. Reliable service. Fair earnings. Built on trust and transparency.
            </p>

            {/* CTAs with valid HTML element structure */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/auth/register?role=customer"
                className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-sm shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#about"
                className="px-6 py-3.5 rounded-xl border border-border bg-white text-text-primary hover:bg-gray-50 active:scale-95 font-bold text-sm transition-colors cursor-pointer inline-flex items-center"
              >
                Learn More
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-text-secondary">
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Workers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fair & Transparent</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-gray-200">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cooperative Owned</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-gray-200">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration Graphic Banner */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-600 to-primary text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-2xl">
                  🤝
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">Sahyog Labour Federation</h3>
                  <p className="text-xs text-gray-200">Empowering skilled community workers</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                  <span>✓ 100% Cooperative Verified Workers</span>
                  <span className="font-bold text-accent">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                  <span>✓ Human Coordinator Manual Allocation</span>
                  <span className="font-bold text-accent">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                  <span>✓ Explainable Candidate Scoring Engine</span>
                  <span className="font-bold text-accent">V2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Highlights Section matching Image 2 */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            We make everyday services simple and reliable
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Structured 4-step cooperative service workflow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3 hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-text-primary text-base">Book a Service</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Choose the service you need and submit a request with your preferred time slot.
            </p>
          </Card>

          <Card className="p-6 space-y-3 hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-secondary flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-text-primary text-base">We Find the Right Worker</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Our cooperative coordinator network evaluates skill, availability, and area to assign the best worker.
            </p>
          </Card>

          <Card className="p-6 space-y-3 hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-text-primary text-base">Work Gets Done</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Verified workers complete the job with quality, safety, and completion notes.
            </p>
          </Card>

          <Card className="p-6 space-y-3 hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-text-primary text-base">You Stay Happy</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Pay digitally, receive a transparent invoice, and rate the service to help us serve you better.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-widest block">
            OUR SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Cooperative Services Available On Demand
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.name} className="p-6 space-y-4 hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-lg">{item.name}</h3>
                  <span className="text-xs text-emerald-700 font-semibold block">{item.hindiName}</span>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. About Us Section */}
      <section id="about" className="bg-emerald-50/50 py-16 px-4 sm:px-6 lg:px-8 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-widest block">
              ABOUT SAHYOG
            </span>
            <h2 className="text-3xl font-extrabold text-text-primary">
              Built for Labour Cooperative Societies
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sahyog is designed specifically for Labour Cooperative Federations and Societies. We bridge the digital gap between skilled workers and household/community service consumers while preserving cooperative governance, fair wages, worker welfare, and human coordinator decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Card className="p-6 space-y-2 bg-white">
              <h4 className="font-bold text-text-primary text-base">Worker Welfare</h4>
              <p className="text-xs text-text-secondary">
                Guaranteed insurance coverage, welfare fund balance tracking, and dignified earnings without platform exploitation.
              </p>
            </Card>

            <Card className="p-6 space-y-2 bg-white">
              <h4 className="font-bold text-text-primary text-base">Human Oversight</h4>
              <p className="text-xs text-text-secondary">
                Cooperative coordinators remain decision-makers for every job assignment, assisted by explainable candidate scoring.
              </p>
            </Card>

            <Card className="p-6 space-y-2 bg-white">
              <h4 className="font-bold text-text-primary text-base">Community Trust</h4>
              <p className="text-xs text-text-secondary">
                100% verified worker profiles associated with registered cooperative societies in Thane and Suburban Mumbai.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Contact Us Section */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-widest block">
            CONTACT US
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Get in Touch with Sahyog
          </h2>
          <p className="text-xs text-text-secondary">
            Have questions about our cooperative services or society registration?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <Card className="p-6 bg-primary text-white space-y-6">
            <div>
              <h3 className="font-extrabold text-xl text-white">Sahyog Federation</h3>
              <p className="text-xs text-gray-300 mt-1">Labour Cooperative Operations Center</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Cooperative Bhavan, Station Road, Thane West, Mumbai 400601</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+91 98200 11223 / +91 22 2540 1000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>contact@sahyog-coop.org</span>
              </div>
            </div>
          </Card>

          {/* Form */}
          <Card className="lg:col-span-2 p-6 sm:p-8 space-y-4">
            {contactSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl text-emerald-900 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you, <strong>{contactName}</strong>. Our cooperative representative will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4" suppressHydrationWarning>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      suppressHydrationWarning
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Priya Verma"
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      suppressHydrationWarning
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    MESSAGE / INQUIRY *
                  </label>
                  <textarea
                    rows={4}
                    required
                    suppressHydrationWarning
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can Sahyog assist your household or society today?"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <Button variant="accent" size="lg" type="submit" suppressHydrationWarning className="w-full sm:w-auto shadow-md cursor-pointer">
                  Send Message →
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
