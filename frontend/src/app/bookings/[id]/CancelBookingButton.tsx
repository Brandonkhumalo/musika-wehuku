"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { api } from "@/lib/client-api";

export function CancelBookingButton({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this booking? Your reserved chicks will be released back to stock.")) {
      return;
    }
    setLoading(true);
    await api.post(`bookings/${bookingId}/cancel/`);
    setLoading(false);
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" loading={loading} onClick={handleCancel}>
      Cancel booking
    </Button>
  );
}
