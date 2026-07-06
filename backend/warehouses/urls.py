from rest_framework.routers import DefaultRouter

from .views import CollectionPointViewSet

router = DefaultRouter()
router.register("", CollectionPointViewSet, basename="collection-point")

urlpatterns = router.urls
