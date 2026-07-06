from rest_framework.routers import DefaultRouter

from .views import PaymentProofViewSet

router = DefaultRouter()
router.register("", PaymentProofViewSet, basename="payment-proof")

urlpatterns = router.urls
