from django.core.management.base import BaseCommand

from warehouses.models import CollectionPoint


class Command(BaseCommand):
    help = "Creates a single demo collection point if none exist yet. Idempotent."

    def handle(self, *args, **options):
        if CollectionPoint.objects.exists():
            self.stdout.write("Collection point(s) already exist, skipping seed.")
            return

        point = CollectionPoint.objects.create(
            name="Elite Breeds & Hatcheries - Harare",
            address="12 Borrowdale Road, Harare, Zimbabwe",
            contact_phone="+263771234567",
        )
        self.stdout.write(self.style.SUCCESS(f"Created demo collection point: {point.name}"))
