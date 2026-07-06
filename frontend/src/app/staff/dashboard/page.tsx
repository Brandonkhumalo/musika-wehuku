import { BookingsOverTimeChart, TopProductsChart } from "@/components/DashboardCharts";
import { StatTile } from "@/components/StatTile";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { djangoFetch } from "@/lib/server-api";
import type { StaffDashboard } from "@/lib/types";

export default async function StaffDashboardPage() {
  const data = await djangoFetch<StaffDashboard>("dashboard/staff/");

  if (!data) {
    return <p className="p-10 text-center text-muted">Could not load the platform dashboard.</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Platform dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile label="Sellers" value={data.total_sellers} />
        <StatTile label="Listings" value={data.total_listings} />
        <StatTile label="Units listed" value={data.total_units_listed} />
        <StatTile label="Sell-through" value={`${data.sell_through_rate}%`} />
        <StatTile label="Cancellation rate" value={`${data.cancellation_rate}%`} />
        <StatTile label="Pending payment reviews" value={data.pending_payment_proofs} />
        <StatTile label="Commission revenue" value={`$${data.commission_revenue}`} hint="2% of collected bookings" />
        <StatTile label="Listing fee revenue" value={`$${data.listing_fee_revenue}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bookings over the last 30 days</CardTitle>
          </CardHeader>
          <CardBody>
            <BookingsOverTimeChart data={data.bookings_over_time} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most-booked products</CardTitle>
          </CardHeader>
          <CardBody>
            <TopProductsChart data={data.top_products} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
