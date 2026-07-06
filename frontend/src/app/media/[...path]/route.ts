import { NextResponse, type NextRequest } from "next/server";

import { DJANGO_URL } from "@/lib/django";

type RouteContext = { params: Promise<{ path: string[] }> };

// Proxied here (evaluated per-request) rather than via a next.config rewrite,
// which bakes its destination in at build time — before BACKEND_INTERNAL_URL is
// known in a Docker build. See next.config.ts for the full explanation.
export async function GET(_request: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  const upstream = await fetch(`${DJANGO_URL}/media/${path.join("/")}`, { cache: "no-store" });

  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
    },
  });
}
