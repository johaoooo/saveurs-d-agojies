from django.db import models
from django.utils.text import slugify


class TypeBoisson(models.TextChoices):
    JUS = 'Jus', 'Jus'
    DESSERT = 'Dessert', 'Dessert'


class CategorieMenu(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    is_active = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        verbose_name = "Catégorie Menu"
        verbose_name_plural = "Catégories Menu"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Plat(models.Model):
    categorie = models.ForeignKey(
        CategorieMenu, on_delete=models.CASCADE, related_name='plats',
        verbose_name="Catégorie"
    )
    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    image = models.ImageField(upload_to='menu/plats/', blank=True, null=True, verbose_name="Image")
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    options_disponibles = models.JSONField(
        default=dict, blank=True,
        verbose_name="Options disponibles",
        help_text="Options de viande/accompagnement disponibles (ex: poulet, lapin, caille, poisson)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")

    class Meta:
        verbose_name = "Plat"
        verbose_name_plural = "Plats"
        ordering = ['categorie__order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Boisson(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    image = models.ImageField(upload_to='menu/boissons/', blank=True, null=True, verbose_name="Image")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    type_boisson = models.CharField(
        max_length=20, choices=TypeBoisson.choices, default=TypeBoisson.JUS,
        verbose_name="Type de boisson"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")

    class Meta:
        verbose_name = "Boisson"
        verbose_name_plural = "Boissons"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
