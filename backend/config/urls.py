from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/ferme/', include('apps.ferme.urls')),
    path('api/menu/', include('apps.menu.urls')),
    path('api/commandes/', include('apps.commandes.urls')),
    path('api/contact/', include('apps.contact.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
