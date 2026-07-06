import Link from "next/link";

import { ListingStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { dateFieldLabel, priceFieldLabel, productDisplayName, unitLabel } from "@/lib/product";
import type { Listing } from "@/lib/types";

// Custom SVG Icons for the details list
function CalendarIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ChickIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 6h4" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  // Calculate reservation progress metrics
  const total = listing.quantity_total || 1;
  const reserved = listing.quantity_reserved || 0;
  const reservedPercent = Math.min(Math.round((reserved / total) * 100), 100);

  return (
    <Link href={`/listings/${listing.id}`} className="block h-full group">
      <Card className="h-full border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-500/20 flex flex-col justify-between overflow-hidden dark:bg-surface/50">
        <CardBody className="flex flex-col gap-4 p-6">
          
          {/* Header row: Breed title + status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg text-foreground tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors duration-300">
                {productDisplayName(listing)}
              </h3>
              <p className="text-xs text-muted font-medium mt-0.5">{listing.seller_name}</p>
            </div>
            <div className="shrink-0">
              <ListingStatusBadge status={listing.status} />
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Details list */}
          <div className="space-y-3.5 my-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span className="text-muted">{dateFieldLabel(listing.product_type)}</span>
              </div>
              <span className="font-semibold text-foreground">{listing.available_date}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ChickIcon />
                <span className="text-muted">Available stock</span>
              </div>
              <span className="font-semibold text-foreground">
                {listing.quantity_available.toLocaleString()}{" "}
                {unitLabel(listing.product_type, listing.quantity_available)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <DollarIcon />
                <span className="text-muted">{priceFieldLabel(listing.product_type)}</span>
              </div>
              <span className="font-extrabold text-foreground text-base">${parseFloat(listing.price_per_unit).toFixed(2)}</span>
            </div>
          </div>

          {/* Reservation progress bar */}
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted">Reserved</span>
              <span className="text-brand-700 dark:text-brand-400">
                {reservedPercent}% ({reserved.toLocaleString()} {unitLabel(listing.product_type, reserved)})
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden dark:bg-stone-850">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  listing.status === "sold_out" ? "bg-stone-400" : "bg-brand-500"
                }`}
                style={{ width: `${reservedPercent}%` }}
              />
            </div>
          </div>
        </CardBody>

        {/* Footer row */}
        <div className="border-t border-border bg-background/50 px-6 py-4 flex items-center justify-between text-xs text-muted dark:bg-background/20">
          <div className="flex items-center gap-1.5 truncate max-w-[70%]">
            <MapPinIcon />
            <span className="truncate font-medium">{listing.collection_point_detail?.name}</span>
          </div>
          <span className="font-bold text-brand-700 group-hover:text-brand-850 dark:text-brand-400 dark:group-hover:text-brand-300 transition-colors shrink-0">
            {listing.status === "active" ? "Reserve Batch →" : "View Batch →"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
