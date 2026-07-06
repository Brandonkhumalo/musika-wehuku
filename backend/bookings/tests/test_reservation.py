import threading

import django.db
from django.core.exceptions import ValidationError
from django.test import TransactionTestCase

from accounts.models import SellerProfile, User
from listings.models import Listing
from warehouses.models import CollectionPoint

from ..models import Booking


def make_listing(quantity_total=10):
    seller = User.objects.create_user(
        phone_number="0771000001", password="pass12345", full_name="Test Seller", role=User.Role.SELLER
    )
    SellerProfile.objects.create(user=seller, business_name="Test Hatchery")
    collection_point = CollectionPoint.objects.create(name="Test Branch", address="123 Test St")
    return Listing.objects.create(
        seller=seller,
        breed="Broiler",
        available_date="2026-08-01",
        quantity_total=quantity_total,
        price_per_unit="1.00",
        collection_point=collection_point,
    )


def make_buyer(phone):
    return User.objects.create_user(
        phone_number=phone, password="pass12345", full_name="Test Buyer", role=User.Role.BUYER
    )


class ReservationCapacityTests(TransactionTestCase):
    reset_sequences = True

    def test_rejects_booking_beyond_available_stock(self):
        listing = make_listing(quantity_total=5)
        buyer = make_buyer("0772000001")

        Booking.create_reservation(
            buyer=buyer, listing_id=listing.id, quantity=4, payment_plan=Booking.PaymentPlan.FULL
        )

        with self.assertRaises(ValidationError):
            Booking.create_reservation(
                buyer=buyer, listing_id=listing.id, quantity=2, payment_plan=Booking.PaymentPlan.FULL
            )

        listing.refresh_from_db()
        self.assertEqual(listing.quantity_reserved, 4)

    def test_concurrent_bookings_never_oversell_stock(self):
        """Two buyers race to reserve chicks from a batch with only enough stock
        for one of them; the row lock in create_reservation must ensure exactly
        one succeeds and total reservations never exceed quantity_total."""
        listing = make_listing(quantity_total=5)
        buyer_a = make_buyer("0772000002")
        buyer_b = make_buyer("0772000003")

        results = {}
        barrier = threading.Barrier(2)

        def attempt(name, buyer_id):
            barrier.wait()
            try:
                Booking.create_reservation(
                    buyer=User.objects.get(pk=buyer_id),
                    listing_id=listing.id,
                    quantity=4,
                    payment_plan=Booking.PaymentPlan.FULL,
                )
                results[name] = "success"
            except ValidationError:
                results[name] = "rejected"
            finally:
                django.db.connection.close()

        t1 = threading.Thread(target=attempt, args=("a", buyer_a.id))
        t2 = threading.Thread(target=attempt, args=("b", buyer_b.id))
        t1.start()
        t2.start()
        t1.join()
        t2.join()

        outcomes = sorted(results.values())
        self.assertEqual(outcomes, ["rejected", "success"])

        listing.refresh_from_db()
        self.assertLessEqual(listing.quantity_reserved, listing.quantity_total)
        self.assertEqual(listing.quantity_reserved, 4)
