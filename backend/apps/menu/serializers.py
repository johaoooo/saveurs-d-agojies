from rest_framework import serializers
from .models import CategorieMenu, Plat, Boisson


class PlatSerializer(serializers.ModelSerializer):
    categorie_name = serializers.CharField(source='categorie.name', read_only=True)

    class Meta:
        model = Plat
        fields = '__all__'


class BoissonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boisson
        fields = '__all__'


class CategorieMenuSerializer(serializers.ModelSerializer):
    plats = PlatSerializer(many=True, read_only=True)

    class Meta:
        model = CategorieMenu
        fields = '__all__'
