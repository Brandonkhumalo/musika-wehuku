"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/client-api";

export function CollectionPointForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("collection-points/", {
        name,
        address,
        contact_phone: phone,
      });
      setName("");
      setAddress("");
      setPhone("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? "Could not add this collection point." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Branch name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Address">
        <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
      </FormField>
      <FormField label="Contact phone">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      {error && <p className="text-sm text-danger-500">{error}</p>}
      <Button type="submit" loading={submitting}>
        Add collection point
      </Button>
    </form>
  );
}
