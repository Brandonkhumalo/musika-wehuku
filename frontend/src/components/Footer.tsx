import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            🐣
          </span>
          Musika WeHuku
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/#marketplace" className="hover:text-brand-700">
            Marketplace
          </Link>
          <Link href="/register" className="hover:text-brand-700">
            Register
          </Link>
          <Link href="/login" className="hover:text-brand-700">
            Log in
          </Link>
        </nav>

        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Musika WeHuku
        </p>
      </div>
    </footer>
  );
}
