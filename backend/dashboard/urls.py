from django.urls import path

from .views import SellerDashboardView, StaffDashboardView

urlpatterns = [
    path("seller/", SellerDashboardView.as_view(), name="seller-dashboard"),
    path("staff/", StaffDashboardView.as_view(), name="staff-dashboard"),
]
