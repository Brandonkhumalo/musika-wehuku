import { NextResponse, type NextRequest } from "next/server";

import { DJANGO_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/session";

export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const upstream = await fetch(`${DJANGO_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const response = NextResponse.json({ role: data.role, full_name: data.full_name });
  setAuthCookies(response, {
    access: data.access,
    refresh: data.refresh,
    role: data.role,
    full_name: data.full_name,
  });
  return response;
}
