from rest_framework.test import APITestCase

from accounts.models import SellerProfile, User
from warehouses.models import CollectionPoint

from ..models import Listing


class ListingPermissionTests(APITestCase):
    def setUp(self):
        self.collection_point = CollectionPoint.objects.create(name="Branch", address="Somewhere")
        self.seller = User.objects.create_user(
            phone_number="0773000001", password="pass12345", full_name="Seller", role=User.Role.SELLER
        )
        SellerProfile.objects.create(user=self.seller, business_name="Hatchery")
        self.buyer = User.objects.create_user(
            phone_number="0773000002", password="pass12345", full_name="Buyer", role=User.Role.BUYER
        )

    def payload(self):
        return {
            "breed": "Layer",
            "available_date": "2026-09-01",
            "quantity_total": 50,
            "price_per_unit": "2.00",
            "collection_point": self.collection_point.id,
        }

    def test_anonymous_can_browse_listings(self):
        response = self.client.get("/api/listings/")
        self.assertEqual(response.status_code, 200)

    def test_buyer_cannot_create_listing(self):
        self.client.force_authenticate(self.buyer)
        response = self.client.post("/api/listings/", self.payload())
        self.assertEqual(response.status_code, 403)

    def test_seller_can_create_listing_and_owns_listing_fee(self):
        self.client.force_authenticate(self.seller)
        response = self.client.post("/api/listings/", self.payload())
        self.assertEqual(response.status_code, 201)

        listing = Listing.objects.get(pk=response.data["id"])
        self.assertEqual(listing.seller, self.seller)
        self.assertTrue(hasattr(listing, "listing_fee"))

    def test_seller_cannot_shrink_quantity_below_committed_stock(self):
        self.client.force_authenticate(self.seller)
        listing = Listing.objects.create(
            seller=self.seller,
            breed="Broiler",
            available_date="2026-09-01",
            quantity_total=10,
            quantity_reserved=6,
            price_per_unit="1.50",
            collection_point=self.collection_point,
        )
        response = self.client.patch(f"/api/listings/{listing.id}/", {"quantity_total": 3})
        self.assertEqual(response.status_code, 400)

    def test_egg_listing_does_not_require_breed(self):
        self.client.force_authenticate(self.seller)
        payload = {
            "product_type": Listing.ProductType.EGG,
            "available_date": "2026-09-01",
            "quantity_total": 360,
            "price_per_unit": "0.15",
            "collection_point": self.collection_point.id,
        }
        response = self.client.post("/api/listings/", payload)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["product_type"], "egg")
        self.assertEqual(response.data["breed"], "")

    def test_chick_listing_requires_breed(self):
        self.client.force_authenticate(self.seller)
        payload = self.payload()
        payload["product_type"] = Listing.ProductType.CHICK
        payload["breed"] = ""
        response = self.client.post("/api/listings/", payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("breed", response.data)
