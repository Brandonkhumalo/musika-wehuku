import "server-only";

import { cookies } from "next/headers";

import { DJANGO_URL } from "@/lib/django";
import { COOKIE } from "@/lib/session";

/** Direct server-to-server fetch to Django, for use in Server Components. */
export async function djangoFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const cookieStore = await cookies();
  const access = cookieStore.get(COOKIE.access)?.value;

  const res = await fetch(`${DJANGO_URL}/api/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getSession() {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE.role)?.value ?? null;
  const fullName = cookieStore.get(COOKIE.name)?.value ?? null;
  return { role, fullName, isAuthenticated: Boolean(role) };
}
