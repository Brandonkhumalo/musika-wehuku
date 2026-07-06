import Link from "next/link";
import { notFound } from "next/navigation";

import { ListingStatusBadge } from "@/components/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { DEFAULT_DEPOSIT_RATE } from "@/lib/constants";
import { dateFieldLabel, priceFieldLabel, productDisplayName, unitLabel } from "@/lib/product";
import { getSession, djangoFetch } from "@/lib/server-api";
import type { Listing } from "@/lib/types";

import { BookingForm } from "./BookingForm";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await djangoFetch<Listing>(`listings/${id}/`);
  if (!listing) notFound();

  const { role, isAuthenticated } = await getSession();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-muted hover:text-brand-700">
        ← Back to marketplace
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{productDisplayName(listing)}</h1>
              <p className="mt-1 text-muted">Listed by {listing.seller_name}</p>
            </div>
            <ListingStatusBadge status={listing.status} />
          </div>

          <Card className="mt-6">
            <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label={dateFieldLabel(listing.product_type)} value={listing.available_date} />
              <Stat label={priceFieldLabel(listing.product_type)} value={`$${listing.price_per_unit}`} />
              <Stat
                label="Available"
                value={`${listing.quantity_available} ${unitLabel(listing.product_type, listing.quantity_available)}`}
              />
              <Stat label="Total batch" value={`${listing.quantity_total}`} />
            </CardBody>
          </Card>

          <Card className="mt-4">
            <CardBody>
              <h2 className="mb-2 font-semibold">Collection point</h2>
              <p className="text-sm">{listing.collection_point_detail?.name}</p>
              <p className="text-sm text-muted">{listing.collection_point_detail?.address}</p>
              {listing.collection_point_detail?.contact_phone && (
                <p className="mt-1 text-sm text-muted">
                  {listing.collection_point_detail.contact_phone}
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardBody>
              <h2 className="mb-4 font-semibold">Reserve {unitLabel(listing.product_type, 2)}</h2>
              {!isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted">
                    Log in as a buyer to reserve {unitLabel(listing.product_type, 2)}.
                  </p>
                  <ButtonLink href={`/login?next=/listings/${listing.id}`}>Log in</ButtonLink>
                  <ButtonLink href="/register" variant="outline">
                    Create an account
                  </ButtonLink>
                </div>
              )}
              {isAuthenticated && role !== "buyer" && (
                <p className="text-sm text-muted">Only buyer accounts can reserve {unitLabel(listing.product_type, 2)}.</p>
              )}
              {isAuthenticated && role === "buyer" && (
                <BookingForm
                  listingId={listing.id}
                  productType={listing.product_type}
                  quantityAvailable={listing.quantity_available}
                  unitPrice={Number(listing.price_per_unit)}
                  depositRate={DEFAULT_DEPOSIT_RATE}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
