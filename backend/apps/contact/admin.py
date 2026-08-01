from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['nom', 'email', 'sujet', 'lu', 'created_at']
    list_editable = ['lu']
    list_filter = ['sujet', 'lu', 'created_at']
    search_fields = ['nom', 'email', 'message']
    readonly_fields = ['created_at']
