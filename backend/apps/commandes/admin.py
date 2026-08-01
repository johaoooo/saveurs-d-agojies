from django.contrib import admin
from .models import Commande


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ['id', 'nom', 'email', 'telephone', 'total', 'statut', 'whatsapp_sent', 'created_at']
    list_editable = ['statut', 'whatsapp_sent']
    list_filter = ['statut', 'whatsapp_sent', 'created_at']
    search_fields = ['nom', 'email', 'telephone']
    readonly_fields = ['created_at', 'updated_at']
