"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { api } from "@/lib/client-api";

export function ToggleActiveButton({ id, isActive }: { id: number; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await api.patch(`collection-points/${id}/`, { is_active: !isActive });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" loading={loading} onClick={toggle}>
      {isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
