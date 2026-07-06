import Link from "next/link";

import { LogoutButton } from "@/components/LogoutButton";
import { ButtonLink } from "@/components/ui/Button";
import { getSession } from "@/lib/server-api";

export async function NavBar() {
  const { role, fullName, isAuthenticated } = await getSession();

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            🐣
          </span>
          Musika WeHuku
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link href="/" className="hover:text-brand-700">
            Marketplace
          </Link>
          {role === "buyer" && (
            <Link href="/bookings" className="hover:text-brand-700">
              My Bookings
            </Link>
          )}
          {role === "seller" && (
            <>
              <Link href="/seller/dashboard" className="hover:text-brand-700">
                Dashboard
              </Link>
              <Link href="/seller/listings" className="hover:text-brand-700">
                My Listings
              </Link>
              <Link href="/seller/bookings" className="hover:text-brand-700">
                Bookings
              </Link>
            </>
          )}
          {(role === "staff" || role === "admin") && (
            <>
              <Link href="/staff/dashboard" className="hover:text-brand-700">
                Dashboard
              </Link>
              <Link href="/staff/payments" className="hover:text-brand-700">
                Payment Reviews
              </Link>
              <Link href="/staff/bookings" className="hover:text-brand-700">
                Bookings
              </Link>
              <Link href="/staff/collection-points" className="hover:text-brand-700">
                Collection Points
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">Hi, {fullName}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/register" variant="primary" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
