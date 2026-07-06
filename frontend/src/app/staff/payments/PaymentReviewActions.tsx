"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { api } from "@/lib/client-api";

export function PaymentReviewActions({ proofId }: { proofId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function approve() {
    setLoading("approve");
    await api.post(`payment-proofs/${proofId}/approve/`);
    setLoading(null);
    router.refresh();
  }

  async function reject() {
    const reason = prompt("Reason for rejecting this payment proof:") ?? "";
    setLoading("reject");
    await api.post(`payment-proofs/${proofId}/reject/`, { rejection_reason: reason });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" loading={loading === "approve"} onClick={approve}>
        Approve
      </Button>
      <Button size="sm" variant="danger" loading={loading === "reject"} onClick={reject}>
        Reject
      </Button>
    </div>
  );
}
