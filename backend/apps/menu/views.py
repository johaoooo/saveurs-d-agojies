from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategorieMenu, Plat, Boisson
from .serializers import CategorieMenuSerializer, PlatSerializer, BoissonSerializer


class CategorieMenuViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CategorieMenu.objects.filter(is_active=True)
    serializer_class = CategorieMenuSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'name']
    lookup_field = 'slug'


class PlatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plat.objects.filter(is_active=True)
    serializer_class = PlatSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['categorie', 'is_featured', 'is_active', 'categorie__slug']
    ordering_fields = ['price', 'name']
    lookup_field = 'slug'


class BoissonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Boisson.objects.filter(is_active=True)
    serializer_class = BoissonSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_active', 'type_boisson']
    ordering_fields = ['name', 'price']
    lookup_field = 'slug'
