from django.conf import settings
from django.db import models


class CommissionLedger(models.Model):
    """2% platform commission, realized once a booking's chicks are collected."""

    booking = models.OneToOneField(
        "bookings.Booking", on_delete=models.CASCADE, related_name="commission_entry"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=4, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commission {self.amount} for booking #{self.booking_id}"


class SellerListingFee(models.Model):
    """Flat fee charged to a seller each time they publish a listing."""

    class Status(models.TextChoices):
        DUE = "due", "Due"
        PAID = "paid", "Paid"
        WAIVED = "waived", "Waived"

    listing = models.OneToOneField(
        "listings.Listing", on_delete=models.CASCADE, related_name="listing_fee"
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listing_fees"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DUE)
    marked_paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="fees_marked_paid",
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Listing fee {self.amount} ({self.status}) - {self.seller}"
