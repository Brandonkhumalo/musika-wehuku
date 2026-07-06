"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Field";
import { ApiError } from "@/lib/client-api";

const schema = z
  .object({
    role: z.enum(["buyer", "seller"]),
    full_name: z.string().min(2, "Enter your full name"),
    phone_number: z.string().min(5, "Enter a valid phone number"),
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(6, "At least 6 characters"),
    business_name: z.string().optional(),
    farm_address: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.role === "seller" && !values.business_name?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["business_name"],
        message: "Business name is required for hatcheries",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const roleHome: Record<string, string> = {
  buyer: "/",
  seller: "/seller/dashboard",
};

export function RegisterForm({ defaultRole = "buyer" }: { defaultRole?: "buyer" | "seller" }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch("role");

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const payload: Record<string, unknown> = {
      role: values.role,
      full_name: values.full_name,
      phone_number: values.phone_number,
      email: values.email || "",
      password: values.password,
    };

    if (values.role === "seller") {
      payload.seller_profile = {
        business_name: values.business_name,
        farm_address: values.farm_address ?? "",
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      };
    } else if (coords) {
      payload.buyer_profile = { latitude: coords.lat, longitude: coords.lng };
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new ApiError(res.status, data);

      router.push(roleHome[values.role] ?? "/");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? "Could not create your account. Check your details and try again."
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-muted">Join as a farmer looking to book chicks, or a hatchery.</p>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-1">
        <label
          className={`cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors ${
            role === "buyer" ? "bg-brand-600 text-white" : "hover:bg-black/5"
          }`}
        >
          <input type="radio" value="buyer" className="hidden" {...register("role")} />
          Farmer / Buyer
        </label>
        <label
          className={`cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors ${
            role === "seller" ? "bg-brand-600 text-white" : "hover:bg-black/5"
          }`}
        >
          <input type="radio" value="seller" className="hidden" {...register("role")} />
          Hatchery / Seller
        </label>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Full name" error={errors.full_name?.message}>
              <Input {...register("full_name")} />
            </FormField>
            <FormField label="Phone number" error={errors.phone_number?.message}>
              <Input placeholder="+263 77 000 0000" {...register("phone_number")} />
            </FormField>
            <FormField label="Email (optional)" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </FormField>
            <FormField label="Password" error={errors.password?.message}>
              <Input type="password" {...register("password")} />
            </FormField>

            {role === "seller" && (
              <>
                <FormField label="Business name" error={errors.business_name?.message}>
                  <Input placeholder="e.g. Elite Breeds & Hatcheries" {...register("business_name")} />
                </FormField>
                <FormField label="Farm address">
                  <Input placeholder="Street, town" {...register("farm_address")} />
                </FormField>
              </>
            )}

            <div className="rounded-lg border border-dashed border-border p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">
                  {coords
                    ? `Location captured (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`
                    : "Share your location so buyers can see how far you are."}
                </span>
                <Button type="button" variant="outline" size="sm" loading={locating} onClick={detectLocation}>
                  Use my location
                </Button>
              </div>
            </div>

            {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
