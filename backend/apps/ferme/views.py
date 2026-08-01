from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategorieFerme, ProduitFerme
from .serializers import CategorieFermeSerializer, ProduitFermeSerializer


class CategorieFermeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CategorieFerme.objects.filter(is_active=True)
    serializer_class = CategorieFermeSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'name']
    lookup_field = 'slug'


class ProduitFermeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProduitFerme.objects.filter(is_active=True)
    serializer_class = ProduitFermeSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['categorie', 'is_featured', 'is_active', 'categorie__slug']
    ordering_fields = ['created_at', 'price', 'name']
    lookup_field = 'slug'
