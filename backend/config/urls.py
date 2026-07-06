from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/collection-points/", include("warehouses.urls")),
    path("api/listings/", include("listings.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/payment-proofs/", include("payments.urls")),
    path("api/finance/", include("finance.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]

# Served by Django/Gunicorn directly (not just in DEBUG) since this is a single-server
# deployment with no separate object storage/CDN. Fine at this traffic scale; move
# payment-proof uploads to S3 + a CDN if that ever changes.
#
# Using the low-level `serve` view (not django.conf.urls.static.static(), which
# silently no-ops unless DEBUG=True) so this also works in production.
urlpatterns += [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
