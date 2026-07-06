from django.contrib import admin

from .models import CommissionLedger, SellerListingFee

admin.site.register(CommissionLedger)
admin.site.register(SellerListingFee)
