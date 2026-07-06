import { NextResponse, type NextRequest } from "next/server";

import { COOKIE } from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(COOKIE.role)?.value;

  const isSeller = pathname.startsWith("/seller");
  const isStaff = pathname.startsWith("/staff");
  const isBuyerOnly = pathname.startsWith("/bookings");

  if (!role && (isSeller || isStaff || isBuyerOnly)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isSeller && role !== "seller") return NextResponse.redirect(new URL("/", request.url));
  if (isStaff && role !== "staff" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isBuyerOnly && role !== "buyer") return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/:path*", "/staff/:path*", "/bookings/:path*"],
};
