from datetime import timedelta

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsOpsStaff, IsSeller
from bookings.models import Booking
from finance.models import CommissionLedger, SellerListingFee
from listings.models import Listing


def _bookings_over_time(qs, days=30):
    since = timezone.now() - timedelta(days=days)
    rows = (
        qs.filter(created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )
    return [{"date": row["day"].isoformat(), "count": row["count"]} for row in rows]


def _top_products(listing_qs, limit=5):
    rows = (
        listing_qs.values("breed", "product_type")
        .annotate(reserved=Sum("quantity_reserved"), collected=Sum("quantity_collected"))
        .order_by("-reserved")[:limit]
    )
    product_labels = dict(Listing.ProductType.choices)
    return [
        {
            "label": row["breed"] or product_labels[row["product_type"]],
            "booked_quantity": (row["reserved"] or 0) + (row["collected"] or 0),
        }
        for row in rows
    ]


def _cancellation_rate(booking_qs):
    total = booking_qs.count()
    if total == 0:
        return 0
    cancelled = booking_qs.filter(
        status__in=[Booking.Status.CANCELLED, Booking.Status.EXPIRED]
    ).count()
    return round(cancelled / total * 100, 1)


class SellerDashboardView(APIView):
    permission_classes = [IsSeller]

    def get(self, request):
        seller = request.user
        listings = Listing.objects.filter(seller=seller)
        bookings = Booking.objects.filter(listing__seller=seller)

        total_listed = sum(l.quantity_total for l in listings)
        total_reserved = sum(l.quantity_reserved for l in listings)
        total_collected = sum(l.quantity_collected for l in listings)
        sell_through_rate = (
            round((total_reserved + total_collected) / total_listed * 100, 1)
            if total_listed
            else 0
        )

        return Response(
            {
                "total_listings": listings.count(),
                "total_units_listed": total_listed,
                "total_reserved": total_reserved,
                "total_collected": total_collected,
                "sell_through_rate": sell_through_rate,
                "cancellation_rate": _cancellation_rate(bookings),
                "bookings_over_time": _bookings_over_time(bookings),
                "top_products": _top_products(listings),
            }
        )


class StaffDashboardView(APIView):
    permission_classes = [IsOpsStaff]

    def get(self, request):
        listings = Listing.objects.all()
        bookings = Booking.objects.all()

        total_listed = sum(l.quantity_total for l in listings)
        total_reserved = sum(l.quantity_reserved for l in listings)
        total_collected = sum(l.quantity_collected for l in listings)
        sell_through_rate = (
            round((total_reserved + total_collected) / total_listed * 100, 1)
            if total_listed
            else 0
        )

        commission_total = CommissionLedger.objects.aggregate(total=Sum("amount"))["total"] or 0
        listing_fee_total = (
            SellerListingFee.objects.filter(status=SellerListingFee.Status.PAID).aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )

        return Response(
            {
                "total_sellers": listings.values("seller").distinct().count(),
                "total_listings": listings.count(),
                "total_units_listed": total_listed,
                "total_reserved": total_reserved,
                "total_collected": total_collected,
                "sell_through_rate": sell_through_rate,
                "cancellation_rate": _cancellation_rate(bookings),
                "bookings_over_time": _bookings_over_time(bookings),
                "top_products": _top_products(listings),
                "commission_revenue": commission_total,
                "listing_fee_revenue": listing_fee_total,
                "pending_payment_proofs": bookings.filter(
                    status=Booking.Status.PAYMENT_SUBMITTED
                ).count(),
            }
        )
