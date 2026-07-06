from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsOpsStaff

from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer


class BookingViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Booking.objects.select_related("buyer", "listing", "listing__seller")

        if user.is_ops_staff:
            return qs
        if user.is_seller:
            return qs.filter(listing__seller=user)
        return qs.filter(buyer=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingSerializer(booking).data, status=201)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.buyer_id != request.user.id and not request.user.is_ops_staff:
            return Response({"detail": "Not allowed."}, status=403)
        if booking.status not in Booking.ACTIVE_STATUSES:
            return Response({"detail": "Booking cannot be cancelled in its current state."}, status=400)
        booking.release_hold(new_status=Booking.Status.CANCELLED)
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"], permission_classes=[IsOpsStaff])
    def collect(self, request, pk=None):
        booking = self.get_object()
        if booking.status != Booking.Status.CONFIRMED:
            return Response(
                {"detail": "Only confirmed bookings can be marked as collected."}, status=400
            )
        booking.mark_collected()
        return Response(BookingSerializer(booking).data)
