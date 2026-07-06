import { Card, CardBody } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import type { CollectionPoint, Paginated } from "@/lib/types";

import { ListingForm } from "../ListingForm";

export default async function NewListingPage() {
  const data = await djangoFetch<Paginated<CollectionPoint>>("collection-points/");
  const collectionPoints = data?.results ?? [];

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">New listing</h1>
      <Card>
        <CardBody>
          <ListingForm collectionPoints={collectionPoints} />
        </CardBody>
      </Card>
    </div>
  );
}
