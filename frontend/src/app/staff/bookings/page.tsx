import { BookingStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { productDisplayName } from "@/lib/product";
import { djangoFetch } from "@/lib/server-api";
import type { Booking, Paginated } from "@/lib/types";

import { CollectButton } from "./CollectButton";

export default async function StaffBookingsPage() {
  const data = await djangoFetch<Paginated<Booking>>("bookings/?ordering=-created_at");
  const bookings = data?.results ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">All bookings</h1>

      <div className="flex flex-col gap-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {booking.quantity} × {productDisplayName(booking.listing_detail)}
                </p>
                <p className="text-sm text-muted">
                  {booking.buyer_name} ({booking.buyer_phone}) ·{" "}
                  {booking.listing_detail.seller_name} · $
                  {booking.total_amount}
                </p>
                <p className="text-sm text-muted">
                  Collect at {booking.listing_detail.collection_point_detail?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <BookingStatusBadge status={booking.status} />
                {booking.status === "confirmed" && <CollectButton bookingId={booking.id} />}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
