from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.utils import timezone


class Booking(models.Model):
    class PaymentPlan(models.TextChoices):
        DEPOSIT = "deposit", "Deposit"
        FULL = "full", "Full payment"

    class Status(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Pending payment"
        PAYMENT_SUBMITTED = "payment_submitted", "Payment submitted"
        CONFIRMED = "confirmed", "Confirmed"
        COLLECTED = "collected", "Collected"
        CANCELLED = "cancelled", "Cancelled"
        EXPIRED = "expired", "Expired"

    ACTIVE_STATUSES = (Status.PENDING_PAYMENT, Status.PAYMENT_SUBMITTED, Status.CONFIRMED)

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings"
    )
    listing = models.ForeignKey(
        "listings.Listing", on_delete=models.CASCADE, related_name="bookings"
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_plan = models.CharField(max_length=10, choices=PaymentPlan.choices)
    amount_due = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING_PAYMENT
    )

    hold_expires_at = models.DateTimeField()
    confirmed_at = models.DateTimeField(null=True, blank=True)
    collected_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking #{self.pk} - {self.quantity} x {self.listing.breed}"

    @classmethod
    @transaction.atomic
    def create_reservation(cls, *, buyer, listing_id, quantity, payment_plan):
        """Lock the listing row and atomically reserve stock so two buyers
        can never reserve the same chicks (prevents overbooking)."""
        from listings.models import Listing

        listing = Listing.objects.select_for_update().get(pk=listing_id)

        if listing.status != Listing.Status.ACTIVE:
            raise ValidationError("This listing is not currently accepting bookings.")
        if quantity < 1:
            raise ValidationError("Quantity must be at least 1.")
        if quantity > listing.quantity_available:
            raise ValidationError(
                f"Only {listing.quantity_available} chicks are available for this listing."
            )

        unit_price = listing.price_per_unit
        total_amount = unit_price * quantity
        deposit_rate = Decimal(str(settings.BOOKING_DEPOSIT_RATE))
        amount_due = (
            total_amount
            if payment_plan == cls.PaymentPlan.FULL
            else round(total_amount * deposit_rate, 2)
        )

        booking = cls.objects.create(
            buyer=buyer,
            listing=listing,
            quantity=quantity,
            unit_price=unit_price,
            total_amount=total_amount,
            payment_plan=payment_plan,
            amount_due=amount_due,
            hold_expires_at=timezone.now() + timedelta(hours=settings.BOOKING_HOLD_HOURS),
        )

        listing.quantity_reserved += quantity
        if listing.quantity_available <= 0:
            listing.status = Listing.Status.SOLD_OUT
        listing.save(update_fields=["quantity_reserved", "status", "updated_at"])

        return booking

    @transaction.atomic
    def release_hold(self, *, new_status):
        """Return reserved quantity back to the listing's available pool."""
        from listings.models import Listing

        listing = Listing.objects.select_for_update().get(pk=self.listing_id)
        listing.quantity_reserved = max(0, listing.quantity_reserved - self.quantity)
        if listing.status == Listing.Status.SOLD_OUT and listing.quantity_available > 0:
            listing.status = Listing.Status.ACTIVE
        listing.save(update_fields=["quantity_reserved", "status", "updated_at"])
        self.listing = listing

        self.status = new_status
        if new_status == self.Status.CANCELLED:
            self.cancelled_at = timezone.now()
        self.save(update_fields=["status", "cancelled_at", "updated_at"])

    @transaction.atomic
    def mark_collected(self):
        """Called by staff once the buyer and seller complete the handover
        at the collection point. Moves stock from reserved -> collected and
        triggers the platform's commission ledger entry."""
        from listings.models import Listing

        listing = Listing.objects.select_for_update().get(pk=self.listing_id)
        listing.quantity_reserved = max(0, listing.quantity_reserved - self.quantity)
        listing.quantity_collected += self.quantity
        listing.save(update_fields=["quantity_reserved", "quantity_collected", "updated_at"])
        self.listing = listing

        self.status = self.Status.COLLECTED
        self.collected_at = timezone.now()
        self.save(update_fields=["status", "collected_at", "updated_at"])

        from finance.models import CommissionLedger

        commission_rate = Decimal(str(settings.PLATFORM_COMMISSION_RATE))
        CommissionLedger.objects.get_or_create(
            booking=self,
            defaults={
                "amount": round(self.total_amount * commission_rate, 2),
                "rate": commission_rate,
            },
        )
