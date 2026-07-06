"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/client-api";
import type { PaymentMethod } from "@/lib/types";

export function PaymentProofForm({ bookingId, amountDue }: { bookingId: number; amountDue: string }) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("ecocash");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState(amountDue);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please attach a screenshot or photo of your payment confirmation.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("booking", String(bookingId));
    formData.append("method", method);
    formData.append("reference_number", reference);
    formData.append("amount", amount);
    formData.append("screenshot", file);

    try {
      await api.post("payment-proofs/", formData);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? "Could not submit proof of payment. Check the details and try again." : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Pay the amount due via EcoCash, OneMoney, or bank transfer to Elite Breeds &amp;
        Hatcheries, then submit your proof below for staff to verify.
      </p>

      <FormField label="Payment method">
        <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          <option value="ecocash">EcoCash</option>
          <option value="onemoney">OneMoney</option>
          <option value="bank_transfer">Bank transfer</option>
        </Select>
      </FormField>

      <FormField label="Reference number">
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Transaction/reference number"
          required
        />
      </FormField>

      <FormField label="Amount paid">
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </FormField>

      <FormField label="Proof (screenshot or photo)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
          required
        />
      </FormField>

      {error && <p className="text-sm text-danger-500">{error}</p>}

      <Button type="submit" loading={submitting}>
        Submit proof of payment
      </Button>
    </form>
  );
}
