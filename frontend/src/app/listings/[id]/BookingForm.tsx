"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/client-api";
import { unitLabel } from "@/lib/product";
import type { Booking, PaymentPlan, ProductType } from "@/lib/types";

const schema = z.object({
  quantity: z.coerce.number().int().min(1, "Enter at least 1"),
  payment_plan: z.enum(["deposit", "full"]),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function BookingForm({
  listingId,
  productType,
  quantityAvailable,
  unitPrice,
  depositRate,
}: {
  listingId: number;
  productType: ProductType;
  quantityAvailable: number;
  unitPrice: number;
  depositRate: number;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: Math.min(10, quantityAvailable || 1), payment_plan: "deposit" as PaymentPlan },
  });

  const quantity = Number(watch("quantity")) || 0;
  const plan = watch("payment_plan");
  const total = quantity * unitPrice;
  const amountDue = plan === "full" ? total : total * depositRate;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const booking = await api.post<Booking>("bookings/", {
        listing_id: listingId,
        quantity: values.quantity,
        payment_plan: values.payment_plan,
      });
      router.push(`/bookings/${booking.id}`);
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError && typeof err.body === "object" && err.body
          ? Object.values(err.body as Record<string, string>).flat().join(" ")
          : "Could not create booking. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label={`Quantity (${unitLabel(productType, quantityAvailable)})`} error={errors.quantity?.message}>
        <Input type="number" min={1} max={quantityAvailable} {...register("quantity")} />
      </FormField>

      <FormField label="Payment plan">
        <Select {...register("payment_plan")}>
          <option value="deposit">Deposit ({Math.round(depositRate * 100)}%)</option>
          <option value="full">Full payment</option>
        </Select>
      </FormField>

      <div className="rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-900/20">
        <div className="flex justify-between">
          <span className="text-muted">Total value</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Due now</span>
          <span className="font-semibold text-brand-700">${amountDue.toFixed(2)}</span>
        </div>
      </div>

      {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

      <Button type="submit" loading={isSubmitting} disabled={quantityAvailable < 1}>
        {quantityAvailable < 1 ? "Sold out" : "Reserve now"}
      </Button>
    </form>
  );
}
