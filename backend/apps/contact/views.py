from rest_framework import viewsets, permissions
from rest_framework.permissions import SAFE_METHODS
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class IsAdminOrCreateOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_staff
        return True


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminOrCreateOnly]
