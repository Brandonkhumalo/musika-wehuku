from rest_framework import permissions, viewsets

from accounts.permissions import IsOpsStaff

from .models import CollectionPoint
from .serializers import CollectionPointSerializer


class CollectionPointViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionPointSerializer
    queryset = CollectionPoint.objects.all()

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.IsAuthenticated()]
        return [IsOpsStaff()]

    def get_queryset(self):
        qs = CollectionPoint.objects.all()
        if self.action == "list" and not self.request.user.is_ops_staff:
            qs = qs.filter(is_active=True)
        return qs
