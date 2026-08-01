from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieMenuViewSet, PlatViewSet, BoissonViewSet

router = DefaultRouter()
router.register(r'categories', CategorieMenuViewSet, basename='categorie-menu')
router.register(r'plats', PlatViewSet, basename='plat')
router.register(r'boissons', BoissonViewSet, basename='boisson')

urlpatterns = [
    path('', include(router.urls)),
]
