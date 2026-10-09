"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/use-app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Layers,
  Check,
} from "lucide-react";

export default function ConsumerPaymentQueuePage() {
  const router = useRouter();
  const { requests, workers, processPayment } = useAppStore();

  const pendingRequests = requests.filter((r) => r.status !== "PAID" && r.status !== "REJECTED");
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    pendingRequests[0]?.id || requests[0]?.id || ""
  );

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0];
  const assignedWorker = workers.find((w) => w.id === activeRequest?.assignedWorkerId);

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [justPaidId, setJustPaidId] = useState<string | null>(null);

  const handlePay = () => {
    if (!activeRequest) return;
    setIsProcessing(true);
    setTimeout(() => {
      processPayment(activeRequest.id, paymentMethod);
      setIsProcessing(false);
      setJustPaidId(activeRequest.id);
    }, 1200);
  };

  const amount = activeRequest?.amount || {
    base: 350,
    fee: 50,
    tax: 72,
    total: 472,
  };

  if (!activeRequest) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-text-primary">No Payments Pending</h2>
        <p className="text-xs text-text-secondary">
          All your service requests have been paid or completed.
        </p>
        <Button variant="accent" onClick={() => router.push("/consumer/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/consumer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Consumer Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-mono text-text-secondary uppercase tracking-widest">
              PAYMENT &amp; BILLING QUEUE
            </span>
            <h1 className="text-2xl font-extrabold text-text-primary mt-1">Payment Queue Console</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-secondary rounded-full text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-secondary" />
            <span>{pendingRequests.length} Pending Payments in Queue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Payment Queue Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold tracking-wider text-text-secondary uppercase">
              1. CHOOSE PAYMENT FROM QUEUE
            </h3>
            <span className="text-[11px] font-bold text-primary">
              {pendingRequests.length} Queued
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {requests.map((req) => {
              const isSelected = req.id === selectedRequestId;
              const isPaid = req.status === "PAID";
              const isPendingCompletion = req.status === "COMPLETION_PENDING";

              return (
                <div
                  key={req.id}
                  onClick={() => {
                    setSelectedRequestId(req.id);
                    setJustPaidId(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? "border-2 border-primary shadow-md bg-blue-50/20 ring-2 ring-primary/20"
                      : "border-border hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white rounded-full text-[10px] font-bold">
                      Selected
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-gray-500 block">
                        {req.id}
                      </span>
                      <h4 className="font-bold text-text-primary text-sm line-clamp-1">
                        {req.title}
                      </h4>
                      <span className="text-xs text-text-secondary block mt-0.5">
                        {req.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 text-xs">
                    <span className="font-extrabold text-primary text-sm">
                      ₹{req.amount?.total || 472}
                    </span>

                    {isPaid ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Paid
                      </span>
                    ) : isPendingCompletion ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold text-[10px] animate-pulse">
                        ● Ready for Payment
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold text-[10px]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Payment & Invoice Details for Selected Item */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-extrabold tracking-wider text-text-secondary uppercase">
            2. INVOICE &amp; PAYMENT DETAILS FOR #{activeRequest.id}
          </h3>

          {justPaidId === activeRequest.id || activeRequest.status === "PAID" ? (
            <Card className="p-8 text-center space-y-4 border-success bg-emerald-50/50">
              <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Payment Completed!</h2>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                ₹{amount.total} paid successfully for <strong>{activeRequest.title}</strong> to{" "}
                <strong>Sahyog Labour Cooperative Federation</strong>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => router.push(`/consumer/rate/${activeRequest.id}`)}
                >
                  Rate Worker Service ★
                </Button>
                {pendingRequests.length > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const nextUnpaid = pendingRequests.find((r) => r.id !== activeRequest.id);
                      if (nextUnpaid) {
                        setSelectedRequestId(nextUnpaid.id);
                        setJustPaidId(null);
                      }
                    }}
                  >
                    Pay Next Pending Request →
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Order Summary Card */}
              <Card className="space-y-4 bg-white">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">
                      ID: {activeRequest.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-secondary">
                      {activeRequest.categoryName}
                    </span>
                  </div>
                  <Badge status={activeRequest.status} />
                </div>

                <div>
                  <h3 className="font-extrabold text-text-primary text-lg">
                    {activeRequest.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    "{activeRequest.problemDescription}"
                  </p>
                </div>

                {assignedWorker && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold block uppercase text-[10px]">
                        ASSIGNED WORKER
                      </span>
                      <span className="font-bold text-text-primary">
                        {assignedWorker.name} ({assignedWorker.workerCode})
                      </span>
                    </div>
                    <span className="font-semibold text-accent">★ {assignedWorker.rating}</span>
                  </div>
                )}

                {/* Itemized Price Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Base Service Fare</span>
                    <span className="font-bold text-text-primary">₹{amount.base}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-secondary">Cooperative Facilitation Fee</span>
                    <span className="font-bold text-text-primary">₹{amount.fee}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-secondary">GST (18%)</span>
                    <span className="font-bold text-text-primary">₹{amount.tax}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-extrabold pt-2 border-t border-gray-200">
                    <span className="text-text-primary">Total Amount Payable</span>
                    <span className="text-primary text-xl">₹{amount.total}</span>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="space-y-4 bg-white">
                <h3 className="text-xs font-bold tracking-widest text-text-secondary uppercase">
                  SELECT PAYMENT METHOD FOR THIS ITEM
                </h3>

                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod("UPI")}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "UPI" ? "border-primary bg-blue-50/40 ring-1 ring-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-xs font-bold text-text-primary block">
                          UPI / GPay / PhonePe / Paytm
                        </span>
                        <span className="text-[10px] text-text-secondary block">
                          Instant zero-fee cooperative transfer
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="pay" checked={paymentMethod === "UPI"} readOnly />
                  </label>

                  <label
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "CARD" ? "border-primary bg-blue-50/40 ring-1 ring-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-xs font-bold text-text-primary block">
                          Credit / Debit Card
                        </span>
                        <span className="text-[10px] text-text-secondary block">
                          Visa, MasterCard, RuPay
                        </span>
                      </div>
                    </div>
                    <input type="radio" name="pay" checked={paymentMethod === "CARD"} readOnly />
                  </label>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Razorpay Digital Gateway Active — Secure Encrypted Payment.</span>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="shadow-md py-3.5 text-base"
                >
                  {isProcessing ? "Processing Payment..." : `Pay ₹${amount.total} for #${activeRequest.id} →`}
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
