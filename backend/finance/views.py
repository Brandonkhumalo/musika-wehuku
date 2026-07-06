from django.utils import timezone
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsOpsStaff

from .models import CommissionLedger, SellerListingFee
from .serializers import CommissionLedgerSerializer, SellerListingFeeSerializer


class CommissionLedgerViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = CommissionLedgerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = CommissionLedger.objects.select_related("booking__listing__seller__seller_profile")
        if user.is_ops_staff:
            return qs
        if user.is_seller:
            return qs.filter(booking__listing__seller=user)
        return qs.none()


class SellerListingFeeViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = SellerListingFeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = SellerListingFee.objects.select_related("listing", "seller")
        if user.is_ops_staff:
            return qs
        if user.is_seller:
            return qs.filter(seller=user)
        return qs.none()

    @action(detail=True, methods=["post"], permission_classes=[IsOpsStaff])
    def mark_paid(self, request, pk=None):
        fee = self.get_object()
        fee.status = SellerListingFee.Status.PAID
        fee.marked_paid_by = request.user
        fee.paid_at = timezone.now()
        fee.save(update_fields=["status", "marked_paid_by", "paid_at"])
        return Response(SellerListingFeeSerializer(fee).data)
