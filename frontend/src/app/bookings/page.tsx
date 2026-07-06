import Link from "next/link";

import { BookingStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { productDisplayName } from "@/lib/product";
import { djangoFetch } from "@/lib/server-api";
import type { Booking, Paginated } from "@/lib/types";

export default async function MyBookingsPage() {
  const data = await djangoFetch<Paginated<Booking>>("bookings/");
  const bookings = data?.results ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">My bookings</h1>

      {bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          You haven&apos;t booked any chicks yet. Head to the marketplace to reserve a batch.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {booking.quantity} × {productDisplayName(booking.listing_detail)}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.listing_detail.seller_name} · ${booking.amount_due} due
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
