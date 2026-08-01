from django.db import models
from django.utils.text import slugify


class TypeElevage(models.TextChoices):
    VOLAILLE = 'Volaille', 'Volaille'
    PETIT_ELEVAGE = 'Petit_Elevage', 'Petit élevage'
    PISCICULTURE = 'Pisciculture', 'Pisciculture'


class TypePlante(models.TextChoices):
    FRUITIER = 'Fruitier', 'Fruitier'
    AROMATIQUE = 'Aromatique', 'Aromatique'
    APICULTURE = 'Apiculture', 'Apiculture'


class CategorieFerme(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    is_active = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        verbose_name = "Catégorie Ferme"
        verbose_name_plural = "Catégories Ferme"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProduitFerme(models.Model):
    categorie = models.ForeignKey(
        CategorieFerme, on_delete=models.CASCADE, related_name='produits',
        verbose_name="Catégorie"
    )
    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    unit = models.CharField(max_length=50, default='pièce', verbose_name="Unité")
    image = models.ImageField(upload_to='ferme/', blank=True, null=True, verbose_name="Image")
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")

    class Meta:
        verbose_name = "Produit Ferme"
        verbose_name_plural = "Produits Ferme"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
