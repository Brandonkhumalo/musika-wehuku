import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingStatusBadge, PaymentProofStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { productDisplayName } from "@/lib/product";
import { djangoFetch } from "@/lib/server-api";
import type { Booking, Paginated, PaymentProof } from "@/lib/types";

import { CancelBookingButton } from "./CancelBookingButton";
import { PaymentProofForm } from "./PaymentProofForm";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await djangoFetch<Booking>(`bookings/${id}/`);
  if (!booking) notFound();

  const proofsData = await djangoFetch<Paginated<PaymentProof>>(
    `payment-proofs/?booking=${id}`
  );
  const proofs = proofsData?.results ?? [];
  const canSubmitProof = ["pending_payment", "payment_submitted"].includes(booking.status);
  const canCancel = ["pending_payment", "payment_submitted", "confirmed"].includes(booking.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/bookings" className="text-sm text-muted hover:text-brand-700">
        ← All bookings
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {booking.quantity} × {productDisplayName(booking.listing_detail)}
          </h1>
          <p className="text-muted">{booking.listing_detail.seller_name}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Card className="mt-6">
        <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Total value" value={`$${booking.total_amount}`} />
          <Stat label="Amount due" value={`$${booking.amount_due}`} />
          <Stat label="Plan" value={booking.payment_plan === "full" ? "Full payment" : "Deposit"} />
          <Stat label="Collection point" value={booking.listing_detail.collection_point_detail?.name ?? "-"} />
        </CardBody>
      </Card>

      {canCancel && (
        <div className="mt-4">
          <CancelBookingButton bookingId={booking.id} />
        </div>
      )}

      {canSubmitProof && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Submit proof of payment</CardTitle>
          </CardHeader>
          <CardBody>
            <PaymentProofForm bookingId={booking.id} amountDue={booking.amount_due} />
          </CardBody>
        </Card>
      )}

      {proofs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {proof.method.replace("_", " ")} · ${proof.amount}
                  </p>
                  <p className="text-muted">Ref: {proof.reference_number}</p>
                  {proof.rejection_reason && (
                    <p className="text-danger-500">Reason: {proof.rejection_reason}</p>
                  )}
                </div>
                <PaymentProofStatusBadge status={proof.status} />
              </div>
            ))}
          </CardBody>
        </Card>
      )}
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
