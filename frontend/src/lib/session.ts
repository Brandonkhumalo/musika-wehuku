import type { NextResponse } from "next/server";

export const COOKIE = {
  access: "mw_access",
  refresh: "mw_refresh",
  role: "mw_role",
  name: "mw_name",
} as const;

export const ROLES = ["buyer", "seller", "staff", "admin"] as const;
export type Role = (typeof ROLES)[number];

const ACCESS_MAX_AGE = 60 * 30; // 30 min, mirrors SIMPLE_JWT access token lifetime
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, mirrors refresh token lifetime

// Deliberately not tied to NODE_ENV: this stays "production" for Next.js's own
// performance optimizations even when Nginx has no TLS in front of it yet, and a
// Secure cookie set over plain HTTP is silently dropped by real browsers on the
// next request — breaking login. Flip COOKIE_SECURE=true once TLS is in place.
const baseCookie = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  data: { access: string; refresh: string; role: string; full_name: string }
) {
  response.cookies.set(COOKIE.access, data.access, { ...baseCookie, maxAge: ACCESS_MAX_AGE });
  response.cookies.set(COOKIE.refresh, data.refresh, { ...baseCookie, maxAge: REFRESH_MAX_AGE });
  response.cookies.set(COOKIE.role, data.role, { ...baseCookie, maxAge: REFRESH_MAX_AGE });
  response.cookies.set(COOKIE.name, data.full_name, {
    ...baseCookie,
    httpOnly: false,
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearAuthCookies(response: NextResponse) {
  for (const name of Object.values(COOKIE)) {
    response.cookies.set(name, "", { ...baseCookie, httpOnly: false, maxAge: 0 });
  }
}
