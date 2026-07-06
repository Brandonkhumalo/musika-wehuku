import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { DJANGO_URL } from "@/lib/django";
import { COOKIE } from "@/lib/session";

const HOP_BY_HOP_REQUEST_HEADERS = new Set(["host", "connection", "content-length", "cookie"]);

async function buildTargetUrl(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search;
  return `${DJANGO_URL}/api/${path.join("/")}/${search}`;
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${DJANGO_URL}/api/auth/login/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access as string;
}

async function proxy(request: NextRequest, path: string[]) {
  const cookieStore = await cookies();
  const targetUrl = await buildTargetUrl(request, path);

  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  const accessToken = cookieStore.get(COOKIE.access)?.value;
  if (accessToken) forwardHeaders.set("Authorization", `Bearer ${accessToken}`);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  // Buffered rather than streamed: Django/Gunicorn's WSGI server can't de-chunk a
  // request body sent without Content-Length, which is what a streamed fetch body
  // produces. These payloads (JSON + the occasional payment-proof image) are small
  // enough that buffering is simpler and correct; fetch sets Content-Length itself
  // once the body is a concrete ArrayBuffer instead of a stream.
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const doFetch = (headers: Headers) =>
    fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

  let upstream = await doFetch(forwardHeaders);
  let refreshedAccess: string | null = null;

  if (upstream.status === 401) {
    const refreshToken = cookieStore.get(COOKIE.refresh)?.value;
    if (refreshToken) {
      refreshedAccess = await refreshAccessToken(refreshToken);
      if (refreshedAccess) {
        forwardHeaders.set("Authorization", `Bearer ${refreshedAccess}`);
        upstream = await doFetch(forwardHeaders);
      }
    }
  }

  const responseBody = await upstream.arrayBuffer();
  const response = new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });

  if (refreshedAccess) {
    response.cookies.set(COOKIE.access, refreshedAccess, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });
  }

  return response;
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  return proxy(request, (await ctx.params).path);
}
export async function POST(request: NextRequest, ctx: RouteContext) {
  return proxy(request, (await ctx.params).path);
}
export async function PATCH(request: NextRequest, ctx: RouteContext) {
  return proxy(request, (await ctx.params).path);
}
export async function PUT(request: NextRequest, ctx: RouteContext) {
  return proxy(request, (await ctx.params).path);
}
export async function DELETE(request: NextRequest, ctx: RouteContext) {
  return proxy(request, (await ctx.params).path);
}
