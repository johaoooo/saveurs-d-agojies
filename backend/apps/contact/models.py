from django.db import models


class SujetContact(models.TextChoices):
    RESTAURATION = 'Restauration', 'Restauration'
    ELEVAGE = 'Elevage', 'Élevage'
    PEPINIERE = 'Pépinière', 'Pépinière'
    TRAITEUR = 'Traiteur', 'Traiteur'
    AUTRE = 'Autre', 'Autre'


class ContactMessage(models.Model):
    nom = models.CharField(max_length=200, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    telephone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    sujet = models.CharField(
        max_length=30, choices=SujetContact.choices,
        default=SujetContact.AUTRE, verbose_name="Sujet"
    )
    message = models.TextField(verbose_name="Message")
    lu = models.BooleanField(default=False, verbose_name="Lu")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nom} - {self.sujet}"
