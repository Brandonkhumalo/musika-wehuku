import Image from "next/image";

import { PaymentProofStatusBadge } from "@/components/StatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import type { Paginated, PaymentProof } from "@/lib/types";

import { PaymentReviewActions } from "./PaymentReviewActions";

export default async function StaffPaymentsPage() {
  const data = await djangoFetch<Paginated<PaymentProof>>("payment-proofs/?ordering=-submitted_at");
  const proofs = data?.results ?? [];
  const pending = proofs.filter((p) => p.status === "pending");
  const reviewed = proofs.filter((p) => p.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Payment verification</h1>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Pending review ({pending.length})
      </h2>
      <div className="mb-8 flex flex-col gap-3">
        {pending.length === 0 && <p className="text-muted">Nothing waiting on you right now.</p>}
        {pending.map((proof) => (
          <Card key={proof.id}>
            <CardBody className="flex items-center gap-4">
              <a href={proof.screenshot ?? "#"} target="_blank" rel="noreferrer">
                <Image
                  src={proof.screenshot ?? "/next.svg"}
                  alt="Payment proof"
                  width={72}
                  height={72}
                  className="rounded-lg border border-border object-cover"
                  unoptimized
                />
              </a>
              <div className="flex-1">
                <p className="font-medium">
                  {proof.method.replace("_", " ")} · ${proof.amount}
                </p>
                <p className="text-sm text-muted">Ref: {proof.reference_number}</p>
                <p className="text-sm text-muted">Booking #{proof.booking}</p>
              </div>
              <PaymentReviewActions proofId={proof.id} />
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Reviewed
      </h2>
      <div className="flex flex-col gap-3">
        {reviewed.map((proof) => (
          <Card key={proof.id}>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {proof.method.replace("_", " ")} · ${proof.amount}
                </p>
                <p className="text-sm text-muted">Booking #{proof.booking}</p>
              </div>
              <PaymentProofStatusBadge status={proof.status} />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
