"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { api } from "@/lib/client-api";

export function CollectButton({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCollect() {
    if (!confirm("Confirm the buyer and seller completed the handover at the collection point?")) {
      return;
    }
    setLoading(true);
    await api.post(`bookings/${bookingId}/collect/`);
    setLoading(false);
    router.refresh();
  }

  return (
    <Button size="sm" variant="secondary" loading={loading} onClick={handleCollect}>
      Mark collected
    </Button>
  );
}
