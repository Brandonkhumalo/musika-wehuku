from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import BuyerProfile, SellerProfile, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Registered only for superuser troubleshooting/data-fixes, not as a product dashboard."""

    model = User
    ordering = ["-date_joined"]
    list_display = ["phone_number", "full_name", "role", "is_active"]
    fieldsets = (
        (None, {"fields": ("phone_number", "password")}),
        ("Personal info", {"fields": ("full_name", "email", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("phone_number", "full_name", "role", "password1", "password2"),
            },
        ),
    )
    search_fields = ["phone_number", "full_name", "email"]


admin.site.register(SellerProfile)
admin.site.register(BuyerProfile)
