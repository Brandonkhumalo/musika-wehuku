from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import BuyerProfile, SellerProfile

User = get_user_model()


class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        data["full_name"] = self.user.full_name
        data["user_id"] = self.user.id
        return data


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = [
            "business_name",
            "farm_address",
            "latitude",
            "longitude",
            "default_collection_point",
        ]


class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ["latitude", "longitude"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    seller_profile = SellerProfileSerializer(required=False)
    buyer_profile = BuyerProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "phone_number",
            "email",
            "full_name",
            "role",
            "password",
            "seller_profile",
            "buyer_profile",
        ]

    def validate_role(self, value):
        if value not in (User.Role.BUYER, User.Role.SELLER):
            raise serializers.ValidationError("Self-registration is only available for buyers and sellers.")
        return value

    def create(self, validated_data):
        seller_profile_data = validated_data.pop("seller_profile", None)
        buyer_profile_data = validated_data.pop("buyer_profile", None)
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)

        if user.role == User.Role.SELLER:
            SellerProfile.objects.create(user=user, **(seller_profile_data or {}))
        else:
            BuyerProfile.objects.create(user=user, **(buyer_profile_data or {}))

        return user


class UserSerializer(serializers.ModelSerializer):
    seller_profile = SellerProfileSerializer(read_only=True)
    buyer_profile = BuyerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "phone_number",
            "email",
            "full_name",
            "role",
            "seller_profile",
            "buyer_profile",
        ]
        read_only_fields = ["id", "phone_number", "role"]
