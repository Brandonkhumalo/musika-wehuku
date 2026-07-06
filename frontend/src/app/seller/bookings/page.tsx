import { BookingStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { productDisplayName } from "@/lib/product";
import { djangoFetch } from "@/lib/server-api";
import type { Booking, Paginated } from "@/lib/types";

export default async function SellerBookingsPage() {
  const data = await djangoFetch<Paginated<Booking>>("bookings/");
  const bookings = data?.results ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Bookings against your listings</h1>

      {bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          No bookings yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardBody className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {booking.quantity} × {productDisplayName(booking.listing_detail)}
                  </p>
                  <p className="text-sm text-muted">
                    Buyer {booking.buyer_name} · ${booking.total_amount} total
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
