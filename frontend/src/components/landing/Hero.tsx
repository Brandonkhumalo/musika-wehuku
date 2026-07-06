import { ButtonLink } from "@/components/ui/Button";

export function Hero({ listingCount }: { listingCount: number }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50/60 via-background to-accent-600/[0.03] dark:from-brand-900/10 dark:via-background dark:to-accent-900/[0.02] border-b border-border">
      {/* Grid Pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-brand-900/[0.04] dark:text-white/[0.04]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Decorative Blur Blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-600/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-20 h-96 w-96 -translate-y-1/2 rounded-full bg-accent-600/15 blur-3xl dark:bg-accent-600/5"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-900/30 dark:bg-brand-950/40 dark:text-brand-300">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Zimbabwe&apos;s Digital Poultry Hub
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Buy and sell day-old chicks and eggs with{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
                absolute trust.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted max-w-2xl">
              Browse available batches from verified hatcheries, secure your order with a 30% deposit, and collect at a verified Elite Breeds branch. Pay remaining balance only after physical handover inspection.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              <ButtonLink
                href="#marketplace"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:shadow-lg transition-all duration-300"
              >
                Browse marketplace
              </ButtonLink>
              <ButtonLink
                href="/register"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-border hover:bg-surface/50 transition-all duration-300"
              >
                Create seller or buyer account
              </ButtonLink>
            </div>

            {/* Micro Stats Grid */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/80 pt-8 w-full max-w-md">
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted mt-1">Verified Hatcheries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">30%</p>
                <p className="text-xs text-muted mt-1">Secured Deposits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">48h</p>
                <p className="text-xs text-muted mt-1">Hold Guarantee</p>
              </div>
            </div>

            {listingCount > 0 && (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted">
                <span className="inline-flex h-2 w-2 rounded-full bg-accent-600 animate-ping" />
                <span>
                  <strong className="font-semibold text-brand-700 dark:text-brand-400">{listingCount}</strong>{" "}
                  {listingCount === 1 ? "batch" : "batches"} currently active in the marketplace.
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Visual Mockup / Ticket */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Background glowing circle */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500/10 to-accent-600/10 blur-2xl opacity-75 dark:opacity-40" />

            <div className="relative w-full max-w-[380px] rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-xl backdrop-blur-md dark:bg-surface/30">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-xl">
                    🐣
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Live Hatch Reservation</h3>
                    <p className="text-xs text-muted">ID: BATCH-4092</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent-100 dark:bg-accent-950/50 px-2.5 py-0.5 text-xs font-semibold text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-900/30">
                  Ready soon
                </span>
              </div>

              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Breed</span>
                  <span className="font-semibold text-foreground">Cobb 500 Broiler</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Hatch date</span>
                  <span className="font-semibold text-foreground">July 12, 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Total Stock</span>
                  <span className="font-semibold text-foreground">5,000 chicks</span>
                </div>

                {/* Progress bar for reserved chicks */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Reservation progress</span>
                    <span className="font-medium text-brand-700 dark:text-brand-400">70% reserved</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500 w-[70%]" />
                  </div>
                </div>

                <div className="rounded-xl bg-background/60 dark:bg-background/40 p-3 border border-border/40 space-y-2">
                  <div className="flex gap-2 text-xs">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">✓</span>
                    <span className="text-muted">Vaccinated (Gumboro & Newcastle)</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">✓</span>
                    <span className="text-muted">Handover at Harare Central Branch</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Price per chick</p>
                  <p className="text-lg font-extrabold text-foreground">$1.15</p>
                </div>
                <ButtonLink
                  href="#marketplace"
                  size="sm"
                  className="bg-accent-600 hover:bg-accent-700 text-white font-medium"
                >
                  Reserve Spot
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
