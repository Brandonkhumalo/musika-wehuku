import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import type { CollectionPoint, Paginated } from "@/lib/types";

import { CollectionPointForm } from "./CollectionPointForm";
import { ToggleActiveButton } from "./ToggleActiveButton";

export default async function CollectionPointsPage() {
  const data = await djangoFetch<Paginated<CollectionPoint>>("collection-points/");
  const points = data?.results ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Collection points</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-3">
            {points.map((cp) => (
              <Card key={cp.id}>
                <CardBody className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{cp.name}</p>
                    <p className="text-sm text-muted">{cp.address}</p>
                    {cp.contact_phone && <p className="text-sm text-muted">{cp.contact_phone}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={cp.is_active ? "success" : "neutral"}>
                      {cp.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <ToggleActiveButton id={cp.id} isActive={cp.is_active} />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Add a branch</CardTitle>
          </CardHeader>
          <CardBody>
            <CollectionPointForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
