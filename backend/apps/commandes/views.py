from rest_framework import viewsets, permissions
from rest_framework.permissions import SAFE_METHODS
from .models import Commande
from .serializers import CommandeSerializer


class IsAdminOrCreateOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_staff
        return True


class CommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.all()
    serializer_class = CommandeSerializer
    permission_classes = [IsAdminOrCreateOnly]

    def perform_create(self, serializer):
        serializer.save(statut='En_attente')
