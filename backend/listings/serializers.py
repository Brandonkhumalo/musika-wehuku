from rest_framework import serializers

from warehouses.serializers import CollectionPointSerializer

from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.seller_profile.business_name", read_only=True)
    seller_latitude = serializers.DecimalField(
        source="seller.seller_profile.latitude", read_only=True, max_digits=9, decimal_places=6
    )
    seller_longitude = serializers.DecimalField(
        source="seller.seller_profile.longitude", read_only=True, max_digits=9, decimal_places=6
    )
    collection_point_detail = CollectionPointSerializer(source="collection_point", read_only=True)
    quantity_available = serializers.IntegerField(read_only=True)
    sell_through_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "seller",
            "seller_name",
            "seller_latitude",
            "seller_longitude",
            "product_type",
            "breed",
            "egg_grade",
            "available_date",
            "quantity_total",
            "quantity_reserved",
            "quantity_collected",
            "quantity_available",
            "sell_through_rate",
            "price_per_unit",
            "collection_point",
            "collection_point_detail",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "seller",
            "quantity_reserved",
            "quantity_collected",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        product_type = attrs.get("product_type", getattr(self.instance, "product_type", Listing.ProductType.CHICK))
        breed = attrs.get("breed", getattr(self.instance, "breed", ""))
        if product_type == Listing.ProductType.CHICK and not breed:
            raise serializers.ValidationError(
                {"breed": "Breed is required for day-old chick listings."}
            )
        return attrs

    def validate_quantity_total(self, value):
        if self.instance is not None:
            committed = self.instance.quantity_reserved + self.instance.quantity_collected
            if value < committed:
                raise serializers.ValidationError(
                    f"Quantity can't be reduced below {committed}, the units already "
                    "reserved or collected."
                )
        return value
