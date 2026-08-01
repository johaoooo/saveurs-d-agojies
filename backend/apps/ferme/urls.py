from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieFermeViewSet, ProduitFermeViewSet

router = DefaultRouter()
router.register(r'categories', CategorieFermeViewSet, basename='categorie-ferme')
router.register(r'produits', ProduitFermeViewSet, basename='produit-ferme')

urlpatterns = [
    path('', include(router.urls)),
]
