"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMonitorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/jobs");
  }, [router]);

  return (
    <div className="p-8 text-center text-text-secondary text-sm">
      Redirecting to Setu Ops Console Jobs Management...
    </div>
  );
}
