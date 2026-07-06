from rest_framework.test import APITestCase

from accounts.models import SellerProfile, User
from listings.models import Listing
from warehouses.models import CollectionPoint

from ..models import Booking


class BookingPermissionTests(APITestCase):
    def setUp(self):
        self.collection_point = CollectionPoint.objects.create(name="Branch", address="Somewhere")
        self.seller = User.objects.create_user(
            phone_number="0774000001", password="pass12345", full_name="Seller", role=User.Role.SELLER
        )
        SellerProfile.objects.create(user=self.seller, business_name="Hatchery")
        self.listing = Listing.objects.create(
            seller=self.seller,
            breed="Broiler",
            available_date="2026-09-01",
            quantity_total=20,
            price_per_unit="1.00",
            collection_point=self.collection_point,
        )
        self.buyer = User.objects.create_user(
            phone_number="0774000002", password="pass12345", full_name="Buyer", role=User.Role.BUYER
        )
        self.other_buyer = User.objects.create_user(
            phone_number="0774000003", password="pass12345", full_name="Other Buyer", role=User.Role.BUYER
        )
        self.staff = User.objects.create_user(
            phone_number="0774000004",
            password="pass12345",
            full_name="Staff",
            role=User.Role.STAFF,
            is_staff=True,
        )

    def test_buyer_can_create_and_view_own_booking(self):
        self.client.force_authenticate(self.buyer)
        response = self.client.post(
            "/api/bookings/",
            {"listing_id": self.listing.id, "quantity": 5, "payment_plan": "deposit"},
        )
        self.assertEqual(response.status_code, 201)

        booking_id = response.data["id"]
        detail = self.client.get(f"/api/bookings/{booking_id}/")
        self.assertEqual(detail.status_code, 200)

    def test_buyer_cannot_see_another_buyers_booking(self):
        booking = Booking.create_reservation(
            buyer=self.buyer, listing_id=self.listing.id, quantity=3, payment_plan=Booking.PaymentPlan.FULL
        )
        self.client.force_authenticate(self.other_buyer)
        response = self.client.get(f"/api/bookings/{booking.id}/")
        self.assertEqual(response.status_code, 404)

    def test_only_staff_can_mark_booking_collected(self):
        booking = Booking.create_reservation(
            buyer=self.buyer, listing_id=self.listing.id, quantity=3, payment_plan=Booking.PaymentPlan.FULL
        )
        booking.status = Booking.Status.CONFIRMED
        booking.save(update_fields=["status"])

        self.client.force_authenticate(self.buyer)
        response = self.client.post(f"/api/bookings/{booking.id}/collect/")
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(self.staff)
        response = self.client.post(f"/api/bookings/{booking.id}/collect/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "collected")

    def test_cannot_collect_before_confirmed(self):
        booking = Booking.create_reservation(
            buyer=self.buyer, listing_id=self.listing.id, quantity=3, payment_plan=Booking.PaymentPlan.FULL
        )
        self.client.force_authenticate(self.staff)
        response = self.client.post(f"/api/bookings/{booking.id}/collect/")
        self.assertEqual(response.status_code, 400)
