from rest_framework import serializers

from .models import CollectionPoint


class CollectionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionPoint
        fields = [
            "id",
            "name",
            "address",
            "latitude",
            "longitude",
            "contact_phone",
            "is_active",
        ]
