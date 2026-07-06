from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


class Listing(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SOLD_OUT = "sold_out", "Sold Out"
        CLOSED = "closed", "Closed"

    class ProductType(models.TextChoices):
        CHICK = "chick", "Day-old chicks"
        EGG = "egg", "Table eggs"

    class EggGrade(models.TextChoices):
        SMALL = "small", "Small"
        MEDIUM = "medium", "Medium"
        LARGE = "large", "Large"
        EXTRA_LARGE = "extra_large", "Extra large"

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings"
    )
    product_type = models.CharField(
        max_length=10, choices=ProductType.choices, default=ProductType.CHICK
    )
    breed = models.CharField(max_length=100, blank=True)
    egg_grade = models.CharField(max_length=15, choices=EggGrade.choices, blank=True)
    available_date = models.DateField(
        help_text="Hatch date for chicks, or pack/collection date for eggs."
    )
    quantity_total = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    quantity_reserved = models.PositiveIntegerField(default=0)
    quantity_collected = models.PositiveIntegerField(default=0)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    collection_point = models.ForeignKey(
        "warehouses.CollectionPoint", on_delete=models.PROTECT, related_name="listings"
    )
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        label = self.breed or self.get_product_type_display()
        return f"{label} x{self.quantity_total} ({self.seller})"

    def clean(self):
        if self.product_type == self.ProductType.CHICK and not self.breed:
            raise ValidationError({"breed": "Breed is required for day-old chick listings."})

    @property
    def quantity_available(self):
        return self.quantity_total - self.quantity_reserved - self.quantity_collected

    @property
    def sell_through_rate(self):
        if self.quantity_total == 0:
            return 0
        return round((self.quantity_reserved + self.quantity_collected) / self.quantity_total * 100, 1)
