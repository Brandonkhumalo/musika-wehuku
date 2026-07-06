import Link from "next/link";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { AlertsSection } from "@/components/landing/AlertsSection";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/product";
import { djangoFetch } from "@/lib/server-api";
import type { Listing, Paginated, ProductType } from "@/lib/types";

// Quick filter tags
const popularBreeds = ["Broiler", "Roadrunner", "Cobb 500", "Layer", "Ross 308"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const productType = params.product_type as ProductType | undefined;
  const query = new URLSearchParams();
  if (params.breed) query.set("breed", params.breed);
  if (productType) query.set("product_type", productType);
  if (params.min_price) query.set("min_price", params.min_price);
  if (params.max_price) query.set("max_price", params.max_price);
  query.set("ordering", params.ordering ?? "-created_at");

  const data = await djangoFetch<Paginated<Listing>>(`listings/?${query.toString()}`);
  const listings = data?.results ?? [];

  const hasActiveFilters = !!(params.breed || productType || params.min_price || params.max_price);

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero listingCount={data?.count ?? 0} />

      {/* 2. Benefits / Value Prop Section */}
      <BenefitsSection />

      {/* 3. Audience Guide Section */}
      <AudienceSection />

      {/* 4. How It Works (Interactive) */}
      <HowItWorksSection />

      {/* 5. Marketplace / Listing Browser Section */}
      <section id="marketplace" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-foreground tracking-tight">
              Browse Available Batches
            </h2>
            <p className="mt-1 text-sm text-muted">
              Live listings verified by Elite Breeds &amp; Hatcheries staff.
            </p>
          </div>
          {hasActiveFilters && (
            <Link
              href="/"
              scroll={false}
              className="text-xs font-bold text-accent-700 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300 underline"
            >
              Clear all search filters
            </Link>
          )}
        </div>

        {/* Premium Search & Filter Bar */}
        <div className="mb-8 rounded-2xl border border-border/80 bg-surface/40 p-5 shadow-sm dark:bg-surface/20">
          <form className="grid gap-4 sm:grid-cols-12 items-end">
            {/* Breed search field */}
            <div className="sm:col-span-6 flex flex-col">
              <label className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                Breed Type / Hatchery
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <Input
                  name="breed"
                  placeholder="Search breed, e.g. Cobb 500, Broiler..."
                  defaultValue={params.breed}
                  className="pl-10 bg-surface dark:bg-surface/30 rounded-xl"
                />
              </div>
            </div>

            {/* Min Price */}
            <div className="sm:col-span-2 flex flex-col">
              <label className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted text-sm font-semibold">
                  $
                </span>
                <Input
                  name="min_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={params.min_price}
                  className="pl-7 bg-surface dark:bg-surface/30 rounded-xl"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="sm:col-span-2 flex flex-col">
              <label className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted text-sm font-semibold">
                  $
                </span>
                <Input
                  name="max_price"
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  defaultValue={params.max_price}
                  className="pl-7 bg-surface dark:bg-surface/30 rounded-xl"
                />
              </div>
            </div>

            {/* Submit search */}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-bold rounded-xl py-2.5 transition-all duration-300"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Product Type Tag Links */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-1">Product:</span>
            <Link
              href="/"
              scroll={false}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 border ${
                !productType
                  ? "bg-accent-600 border-accent-600 text-white"
                  : "bg-surface border-border text-muted hover:border-accent-500/40 hover:text-foreground dark:bg-surface/30"
              }`}
            >
              All Products
            </Link>
            {PRODUCT_TYPE_OPTIONS.map((option) => {
              const isActive = productType === option.value;
              const linkParams = new URLSearchParams(query);
              linkParams.set("product_type", option.value);
              linkParams.delete("breed");

              return (
                <Link
                  key={option.value}
                  href={`/?${linkParams.toString()}`}
                  scroll={false}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-accent-600 border-accent-600 text-white"
                      : "bg-surface border-border text-muted hover:border-accent-500/40 hover:text-foreground dark:bg-surface/30"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Filter Tag Links */}
          <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-1">Quick filters:</span>
            <Link
              href="/"
              scroll={false}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 border ${
                !params.breed
                  ? "bg-brand-500 border-brand-500 text-white"
                  : "bg-surface border-border text-muted hover:border-brand-500/40 hover:text-foreground dark:bg-surface/30"
              }`}
            >
              All Breeds
            </Link>
            {popularBreeds.map((breed) => {
              const isActive = params.breed === breed;
              const linkParams = new URLSearchParams(query);
              linkParams.set("breed", breed);

              return (
                <Link
                  key={breed}
                  href={`/?${linkParams.toString()}`}
                  scroll={false}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-brand-500 border-brand-500 text-white"
                      : "bg-surface border-border text-muted hover:border-brand-500/40 hover:text-foreground dark:bg-surface/30"
                  }`}
                >
                  {breed}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center bg-surface/20">
            <span className="text-4xl" aria-hidden>🔍</span>
            <h3 className="mt-3 text-lg font-bold text-foreground">No matching batches found</h3>
            <p className="mt-1 text-sm text-muted max-w-sm mx-auto">
              No hatcheries have listings matching your query right now. Try expanding your price range or clearing search tags.
            </p>
            {hasActiveFilters && (
              <Link href="/" scroll={false}>
                <Button variant="outline" className="mt-6 border-border hover:bg-surface rounded-xl">
                  Reset search filters
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 6. FAQ Section Accordion */}
      <FaqSection />

      {/* 7. Newsletter & SMS Alerts */}
      <AlertsSection />
    </div>
  );
}
