from django.contrib import admin
from .models import CategorieFerme, ProduitFerme


@admin.register(CategorieFerme)
class CategorieFermeAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(ProduitFerme)
class ProduitFermeAdmin(admin.ModelAdmin):
    list_display = ['name', 'categorie', 'price', 'stock', 'is_featured', 'is_active']
    list_editable = ['price', 'stock', 'is_featured', 'is_active']
    list_filter = ['categorie', 'is_featured', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
