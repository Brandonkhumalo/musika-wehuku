from django.core.management.base import BaseCommand
from django.utils import timezone

from bookings.models import Booking


class Command(BaseCommand):
    help = (
        "Releases stock held by bookings that never had payment approved within "
        "the configured hold window. Intended to run every few minutes via cron."
    )

    def handle(self, *args, **options):
        stale = Booking.objects.filter(
            status__in=[Booking.Status.PENDING_PAYMENT, Booking.Status.PAYMENT_SUBMITTED],
            hold_expires_at__lt=timezone.now(),
        )
        count = 0
        for booking in stale:
            booking.release_hold(new_status=Booking.Status.EXPIRED)
            count += 1

        self.stdout.write(self.style.SUCCESS(f"Expired {count} stale booking(s)."))
