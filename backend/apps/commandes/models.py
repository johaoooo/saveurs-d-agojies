from django.db import models


class StatutCommande(models.TextChoices):
    EN_ATTENTE = 'En_attente', 'En attente'
    CONFIRMEE = 'Confirmee', 'Confirmée'
    EN_PREPARATION = 'En_preparation', 'En préparation'
    LIVREE = 'Livree', 'Livrée'
    ANNULEE = 'Annulee', 'Annulée'


class Commande(models.Model):
    nom = models.CharField(max_length=200, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    telephone = models.CharField(max_length=20, verbose_name="Téléphone")
    adresse_livraison = models.TextField(verbose_name="Adresse de livraison")
    notes = models.TextField(blank=True, verbose_name="Notes")
    items = models.JSONField(verbose_name="Articles commandés")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total")
    statut = models.CharField(
        max_length=20, choices=StatutCommande.choices,
        default=StatutCommande.EN_ATTENTE, verbose_name="Statut"
    )
    whatsapp_sent = models.BooleanField(default=False, verbose_name="WhatsApp envoyé")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créée le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mise à jour le")

    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ['-created_at']

    def __str__(self):
        return f"Commande #{self.id} - {self.nom}"
