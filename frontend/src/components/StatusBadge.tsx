import { Badge } from "@/components/ui/Badge";
import type { BookingStatus, ListingStatus, PaymentProofStatus } from "@/lib/types";

const bookingStatusMap: Record<BookingStatus, { label: string; tone: Parameters<typeof Badge>[0]["tone"] }> = {
  pending_payment: { label: "Pending payment", tone: "warning" },
  payment_submitted: { label: "Payment submitted", tone: "info" },
  confirmed: { label: "Confirmed", tone: "brand" },
  collected: { label: "Collected", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  expired: { label: "Expired", tone: "danger" },
};

const listingStatusMap: Record<ListingStatus, { label: string; tone: Parameters<typeof Badge>[0]["tone"] }> = {
  active: { label: "Active", tone: "success" },
  sold_out: { label: "Sold out", tone: "warning" },
  closed: { label: "Closed", tone: "neutral" },
};

const paymentProofStatusMap: Record<PaymentProofStatus, { label: string; tone: Parameters<typeof Badge>[0]["tone"] }> = {
  pending: { label: "Pending review", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, tone } = bookingStatusMap[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const { label, tone } = listingStatusMap[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function PaymentProofStatusBadge({ status }: { status: PaymentProofStatus }) {
  const { label, tone } = paymentProofStatusMap[status];
  return <Badge tone={tone}>{label}</Badge>;
}
