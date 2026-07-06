"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Field";
import { ApiError } from "@/lib/client-api";

const schema = z.object({
  phone_number: z.string().min(5, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const roleHome: Record<string, string> = {
  buyer: "/",
  seller: "/seller/dashboard",
  staff: "/staff/dashboard",
  admin: "/staff/dashboard",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new ApiError(res.status, data);

      const next = searchParams.get("next");
      router.push(next ?? roleHome[data.role] ?? "/");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? "Incorrect phone number or password."
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-muted">Log in to book chicks or manage your listings.</p>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Phone number" error={errors.phone_number?.message}>
              <Input placeholder="+263 77 000 0000" {...register("phone_number")} />
            </FormField>
            <FormField label="Password" error={errors.password?.message}>
              <Input type="password" {...register("password")} />
            </FormField>

            {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              Log in
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-brand-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
