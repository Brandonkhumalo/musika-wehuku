import Link from "next/link";

import { ListingStatusBadge } from "@/components/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import { productDisplayName, unitLabel } from "@/lib/product";
import type { Listing, Paginated } from "@/lib/types";

export default async function SellerListingsPage() {
  const data = await djangoFetch<Paginated<Listing>>("listings/");
  const listings = data?.results ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My listings</h1>
        <ButtonLink href="/seller/listings/new">+ New listing</ButtonLink>
      </div>

      {listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          You haven&apos;t published any listings yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardBody className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{productDisplayName(listing)}</p>
                  <p className="text-sm text-muted">
                    {listing.available_date} · {listing.quantity_available} available of{" "}
                    {listing.quantity_total} · ${listing.price_per_unit}/
                    {unitLabel(listing.product_type, 1)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ListingStatusBadge status={listing.status} />
                  <Link
                    href={`/seller/listings/${listing.id}/edit`}
                    className="text-sm font-medium text-brand-700"
                  >
                    Edit
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
