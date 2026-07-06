from django.utils import timezone
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsOpsStaff
from bookings.models import Booking

from .models import PaymentProof
from .serializers import PaymentProofReviewSerializer, PaymentProofSerializer


class PaymentProofViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = PaymentProofSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = PaymentProof.objects.select_related("booking", "booking__buyer")
        if user.is_ops_staff:
            pass
        elif user.is_seller:
            qs = qs.filter(booking__listing__seller=user)
        else:
            qs = qs.filter(booking__buyer=user)

        booking_id = self.request.query_params.get("booking")
        if booking_id:
            qs = qs.filter(booking_id=booking_id)
        return qs

    def perform_create(self, serializer):
        proof = serializer.save()
        proof.booking.status = Booking.Status.PAYMENT_SUBMITTED
        proof.booking.save(update_fields=["status", "updated_at"])

    @action(detail=True, methods=["post"], permission_classes=[IsOpsStaff])
    def approve(self, request, pk=None):
        proof = self.get_object()
        proof.status = PaymentProof.Status.APPROVED
        proof.reviewed_by = request.user
        proof.reviewed_at = timezone.now()
        proof.save(update_fields=["status", "reviewed_by", "reviewed_at"])

        booking = proof.booking
        booking.status = Booking.Status.CONFIRMED
        booking.confirmed_at = timezone.now()
        booking.save(update_fields=["status", "confirmed_at", "updated_at"])
        return Response(PaymentProofSerializer(proof).data)

    @action(detail=True, methods=["post"], permission_classes=[IsOpsStaff])
    def reject(self, request, pk=None):
        proof = self.get_object()
        serializer = PaymentProofReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        proof.status = PaymentProof.Status.REJECTED
        proof.reviewed_by = request.user
        proof.reviewed_at = timezone.now()
        proof.rejection_reason = serializer.validated_data.get("rejection_reason", "")
        proof.save(update_fields=["status", "reviewed_by", "reviewed_at", "rejection_reason"])

        booking = proof.booking
        booking.status = Booking.Status.PENDING_PAYMENT
        booking.save(update_fields=["status", "updated_at"])
        return Response(PaymentProofSerializer(proof).data)
