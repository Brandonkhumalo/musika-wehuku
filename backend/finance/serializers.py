from rest_framework import serializers

from .models import CommissionLedger, SellerListingFee


class CommissionLedgerSerializer(serializers.ModelSerializer):
    breed = serializers.CharField(source="booking.listing.breed", read_only=True)
    seller_name = serializers.CharField(
        source="booking.listing.seller.seller_profile.business_name", read_only=True
    )

    class Meta:
        model = CommissionLedger
        fields = ["id", "booking", "breed", "seller_name", "amount", "rate", "created_at"]
        read_only_fields = fields


class SellerListingFeeSerializer(serializers.ModelSerializer):
    breed = serializers.CharField(source="listing.breed", read_only=True)

    class Meta:
        model = SellerListingFee
        fields = [
            "id",
            "listing",
            "breed",
            "seller",
            "amount",
            "status",
            "marked_paid_by",
            "paid_at",
            "created_at",
        ]
        read_only_fields = ["id", "listing", "breed", "seller", "amount", "marked_paid_by", "paid_at", "created_at"]
