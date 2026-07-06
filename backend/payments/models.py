from django.conf import settings
from django.db import models


def payment_proof_path(instance, filename):
    return f"payment_proofs/booking_{instance.booking_id}/{filename}"


class PaymentProof(models.Model):
    class Method(models.TextChoices):
        ECOCASH = "ecocash", "EcoCash"
        ONEMONEY = "onemoney", "OneMoney"
        BANK_TRANSFER = "bank_transfer", "Bank transfer"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    booking = models.ForeignKey(
        "bookings.Booking", on_delete=models.CASCADE, related_name="payment_proofs"
    )
    method = models.CharField(max_length=20, choices=Method.choices)
    reference_number = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    screenshot = models.ImageField(upload_to=payment_proof_path)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_payment_proofs",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Proof for booking #{self.booking_id} ({self.status})"
