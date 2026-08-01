from rest_framework import serializers
from .models import CategorieFerme, ProduitFerme


class ProduitFermeSerializer(serializers.ModelSerializer):
    categorie_name = serializers.CharField(source='categorie.name', read_only=True)

    class Meta:
        model = ProduitFerme
        fields = '__all__'


class CategorieFermeSerializer(serializers.ModelSerializer):
    produits = ProduitFermeSerializer(many=True, read_only=True)

    class Meta:
        model = CategorieFerme
        fields = '__all__'
