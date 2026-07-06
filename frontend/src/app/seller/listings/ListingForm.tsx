"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/client-api";
import { dateFieldLabel, EGG_GRADE_OPTIONS, priceFieldLabel, PRODUCT_TYPE_OPTIONS } from "@/lib/product";
import type { CollectionPoint, Listing } from "@/lib/types";

const schema = z
  .object({
    product_type: z.enum(["chick", "egg"]),
    breed: z.string().optional(),
    egg_grade: z.enum(["small", "medium", "large", "extra_large", ""]).optional(),
    available_date: z.string().min(1, "Select a date"),
    quantity_total: z.coerce.number().int().min(1, "Enter at least 1 unit"),
    price_per_unit: z.coerce.number().min(0.01, "Enter a price"),
    collection_point: z.coerce.number().int().min(1, "Select a collection point"),
  })
  .superRefine((values, ctx) => {
    if (values.product_type === "chick" && !values.breed?.trim()) {
      ctx.addIssue({ code: "custom", path: ["breed"], message: "Breed is required for chick listings" });
    }
  });

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function ListingForm({
  collectionPoints,
  listing,
}: {
  collectionPoints: CollectionPoint[];
  listing?: Listing;
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
    defaultValues: listing
      ? {
          product_type: listing.product_type,
          breed: listing.breed,
          egg_grade: listing.egg_grade,
          available_date: listing.available_date,
          quantity_total: listing.quantity_total,
          price_per_unit: Number(listing.price_per_unit),
          collection_point: listing.collection_point,
        }
      : { product_type: "chick", quantity_total: 100 },
  });

  const productType = watch("product_type");

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      if (listing) {
        await api.patch(`listings/${listing.id}/`, values);
      } else {
        await api.post("listings/", values);
      }
      router.push("/seller/listings");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError && typeof err.body === "object" && err.body
          ? Object.values(err.body as Record<string, string>).flat().join(" ")
          : "Could not save this listing. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Product type">
        <Select {...register("product_type")}>
          {PRODUCT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      {productType === "chick" ? (
        <FormField label="Breed" error={errors.breed?.message}>
          <Input placeholder="e.g. Broiler, Road Runner" {...register("breed")} />
        </FormField>
      ) : (
        <FormField label="Egg grade (optional)">
          <Select {...register("egg_grade")}>
            <option value="">Not graded</option>
            {EGG_GRADE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <FormField label={dateFieldLabel(productType)} error={errors.available_date?.message}>
        <Input type="date" {...register("available_date")} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Quantity" error={errors.quantity_total?.message}>
          <Input type="number" min={1} {...register("quantity_total")} />
        </FormField>
        <FormField label={`${priceFieldLabel(productType)} ($)`} error={errors.price_per_unit?.message}>
          <Input type="number" step="0.01" min={0.01} {...register("price_per_unit")} />
        </FormField>
      </div>

      <FormField label="Collection point" error={errors.collection_point?.message}>
        <Select {...register("collection_point")}>
          <option value="">Select a collection point</option>
          {collectionPoints.map((cp) => (
            <option key={cp.id} value={cp.id}>
              {cp.name}
            </option>
          ))}
        </Select>
      </FormField>

      {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

      <Button type="submit" loading={isSubmitting}>
        {listing ? "Save changes" : "Publish listing"}
      </Button>
    </form>
  );
}
