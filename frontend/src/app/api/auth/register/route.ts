import { NextResponse, type NextRequest } from "next/server";

import { DJANGO_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/session";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const registerRes = await fetch(`${DJANGO_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const registerData = await registerRes.json();
  if (!registerRes.ok) {
    return NextResponse.json(registerData, { status: registerRes.status });
  }

  const loginRes = await fetch(`${DJANGO_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_number: payload.phone_number,
      password: payload.password,
    }),
    cache: "no-store",
  });
  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    // Account was created but auto-login failed; the user can still log in manually.
    return NextResponse.json({ role: registerData.role }, { status: 201 });
  }

  const response = NextResponse.json({ role: loginData.role, full_name: loginData.full_name });
  setAuthCookies(response, {
    access: loginData.access,
    refresh: loginData.refresh,
    role: loginData.role,
    full_name: loginData.full_name,
  });
  return response;
}
