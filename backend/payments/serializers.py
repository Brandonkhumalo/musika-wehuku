from rest_framework import serializers

from .models import PaymentProof


class PaymentProofSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentProof
        fields = [
            "id",
            "booking",
            "method",
            "reference_number",
            "amount",
            "screenshot",
            "status",
            "submitted_at",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
        ]
        read_only_fields = ["id", "status", "submitted_at", "reviewed_by", "reviewed_at"]

    def to_representation(self, instance):
        # Deliberately relative (not request.build_absolute_uri): this API is reached
        # server-to-server (Next.js -> Django) using an internal host, which would
        # otherwise get baked into the URL. The frontend resolves it against its own
        # origin, which a rewrite maps to Django's /media/ in both dev and prod.
        data = super().to_representation(instance)
        data["screenshot"] = instance.screenshot.url if instance.screenshot else None
        return data

    def validate_booking(self, booking):
        request = self.context["request"]
        if booking.buyer_id != request.user.id:
            raise serializers.ValidationError("You can only upload proof for your own booking.")
        from bookings.models import Booking

        if booking.status not in (Booking.Status.PENDING_PAYMENT, Booking.Status.PAYMENT_SUBMITTED):
            raise serializers.ValidationError("This booking is not awaiting payment.")
        return booking


class PaymentProofReviewSerializer(serializers.Serializer):
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
