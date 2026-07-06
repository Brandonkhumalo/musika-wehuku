from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from listings.serializers import ListingSerializer

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    listing_detail = ListingSerializer(source="listing", read_only=True)
    buyer_name = serializers.CharField(source="buyer.full_name", read_only=True)
    buyer_phone = serializers.CharField(source="buyer.phone_number", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "buyer",
            "buyer_name",
            "buyer_phone",
            "listing",
            "listing_detail",
            "quantity",
            "unit_price",
            "total_amount",
            "payment_plan",
            "amount_due",
            "status",
            "hold_expires_at",
            "confirmed_at",
            "collected_at",
            "cancelled_at",
            "created_at",
        ]
        read_only_fields = fields


class BookingCreateSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    payment_plan = serializers.ChoiceField(choices=Booking.PaymentPlan.choices)

    def create(self, validated_data):
        request = self.context["request"]
        try:
            return Booking.create_reservation(
                buyer=request.user,
                listing_id=validated_data["listing_id"],
                quantity=validated_data["quantity"],
                payment_plan=validated_data["payment_plan"],
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.message)
