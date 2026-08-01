from rest_framework import serializers
from .models import Commande


class CommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commande
        fields = '__all__'
        read_only_fields = ['statut', 'whatsapp_sent', 'created_at', 'updated_at']
