from rest_framework.routers import DefaultRouter

from .views import CommissionLedgerViewSet, SellerListingFeeViewSet

router = DefaultRouter()
router.register("commissions", CommissionLedgerViewSet, basename="commission")
router.register("listing-fees", SellerListingFeeViewSet, basename="listing-fee")

urlpatterns = router.urls
