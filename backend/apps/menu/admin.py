from django.contrib import admin
from .models import CategorieMenu, Plat, Boisson


@admin.register(CategorieMenu)
class CategorieMenuAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Plat)
class PlatAdmin(admin.ModelAdmin):
    list_display = ['name', 'categorie', 'price', 'is_featured', 'is_active']
    list_editable = ['price', 'is_featured', 'is_active']
    list_filter = ['categorie', 'is_featured', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(Boisson)
class BoissonAdmin(admin.ModelAdmin):
    list_display = ['name', 'type_boisson', 'price', 'is_active']
    list_editable = ['price', 'is_active']
    list_filter = ['type_boisson', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
