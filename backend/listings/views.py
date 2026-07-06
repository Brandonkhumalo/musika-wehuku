from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from accounts.permissions import IsSeller

from .models import Listing
from .serializers import ListingSerializer


class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["breed", "product_type", "status", "collection_point"]
    ordering_fields = ["price_per_unit", "available_date", "created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsSeller()]

    def get_queryset(self):
        qs = Listing.objects.select_related("seller__seller_profile", "collection_point")
        user = self.request.user
        is_seller = user.is_authenticated and user.is_seller
        is_ops_staff = user.is_authenticated and user.is_ops_staff

        if self.action == "list" and not (is_seller or is_ops_staff):
            qs = qs.filter(status=Listing.Status.ACTIVE)
        elif is_seller and self.action in ("list", "update", "partial_update", "destroy"):
            qs = qs.filter(seller=user)

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price_per_unit__gte=min_price)
        if max_price:
            qs = qs.filter(price_per_unit__lte=max_price)

        return qs

    def perform_create(self, serializer):
        from finance.models import SellerListingFee

        listing = serializer.save(seller=self.request.user)
        SellerListingFee.objects.create(
            listing=listing,
            seller=self.request.user,
            amount=settings.SELLER_LISTING_FEE,
        )
