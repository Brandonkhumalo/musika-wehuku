import { notFound } from "next/navigation";

import { Card, CardBody } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import type { CollectionPoint, Listing, Paginated } from "@/lib/types";

import { ListingForm } from "../../ListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, collectionPointsData] = await Promise.all([
    djangoFetch<Listing>(`listings/${id}/`),
    djangoFetch<Paginated<CollectionPoint>>("collection-points/"),
  ]);

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Edit listing</h1>
      <Card>
        <CardBody>
          <ListingForm collectionPoints={collectionPointsData?.results ?? []} listing={listing} />
        </CardBody>
      </Card>
    </div>
  );
}
