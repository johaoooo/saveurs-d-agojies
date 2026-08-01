import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.ferme.models import CategorieFerme, ProduitFerme
from apps.menu.models import CategorieMenu, Plat, Boisson, TypeBoisson

class Command(BaseCommand):
    help = "Remplit la base de données avec le catalogue officiel de Saveurs d'Agojie"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("--- Début du chargement des données Saveurs d'Agojie ---"))

        # =========================================================================
        # 1. FERME & PÉPINIÈRE
        # =========================================================================
        categories_ferme_data = [
            {
                "name": "Élevage & Oiseaux",
                "icon": "🐓",
                "order": 1,
                "description": "Oies de Chine, Pintades, Dindes, Volaille Goliath, Lapins, Cobayes, Moutons (Bali Bali, Balami, Oudah), Chèvres de Maradi",
                "produits": [
                    {"name": "Oies de Chine (souche pure)", "price": 15000, "unit": "pièce", "stock": 50, "description": "Oies de Chine de race pure, élevées en plein air"},
                    {"name": "Pintades & Pintadeaux", "price": 5000, "unit": "pièce", "stock": 100, "description": "Pintades de ferme réputées pour leur chair savoureuse"},
                    {"name": "Dindes (Bronzé d'Amérique) & Dindonneaux", "price": 18000, "unit": "pièce", "stock": 30, "description": "Dindes de grande taille élevées au grain"},
                    {"name": "Poulets & Poussins Goliath", "price": 4500, "unit": "pièce", "stock": 200, "description": "Poulets Goliath vigoureux et à croissance rapide"},
                    {"name": "Poulets locaux Souche Pure & Poussins", "price": 4000, "unit": "pièce", "stock": 150, "description": "Poulets fermiers locaux 100% naturels"},
                    {"name": "Poulets améliorés cou nu", "price": 4500, "unit": "pièce", "stock": 120, "description": "Poulets de race cou nu résistants et charnus"},
                    {"name": "Cailles & Cailleteaux", "price": 1500, "unit": "pièce", "stock": 300, "description": "Cailles d'élevage pour viande et ponte"},
                    {"name": "Cobayes & BB cobayes", "price": 2500, "unit": "pièce", "stock": 80, "description": "Élevage soigné de cobayes de ferme"},
                    {"name": "Lapins & Lapereaux", "price": 6000, "unit": "pièce", "stock": 90, "description": "Lapins fermiers nourris aux herbes de la ferme"},
                    {"name": "Mouton Race Bali Bali (Race Peulh)", "price": 65000, "unit": "pièce", "stock": 15, "description": "Mouton Bali Bali de grande stature, parfait pour élevage et festivités"},
                    {"name": "Mouton Race Balami", "price": 75000, "unit": "pièce", "stock": 10, "description": "Mouton Balami imposant et bien conformé"},
                    {"name": "Mouton Race Oudah", "price": 70000, "unit": "pièce", "stock": 12, "description": "Mouton Oudah bicolore très prisé"},
                    {"name": "Chèvre rousse de Maradi", "price": 45000, "unit": "pièce", "stock": 20, "description": "Chèvre rousse de Maradi prolifique et rustique"}
                ]
            },
            {
                "name": "Pisciculture",
                "icon": "🐟",
                "order": 2,
                "description": "Poissons marchands et alevins (Clarias, Tilapia, Pengasius, Bramar)",
                "produits": [
                    {"name": "Poissons Clarias (Poisson-chat)", "price": 3500, "unit": "kg", "stock": 500, "description": "Clarias frais issus de nos bassins aquacoles"},
                    {"name": "Poissons Tilapia frais", "price": 3000, "unit": "kg", "stock": 400, "description": "Tilapia de qualité supérieure nourri bio"},
                    {"name": "Poissons Pengasius & Bramar", "price": 3500, "unit": "kg", "stock": 300, "description": "Poissons d'eau douce à chair blanche et ferme"},
                    {"name": "Alevins sélectionnés (Clarias / Tilapia / Pengasius)", "price": 150, "unit": "pièce", "stock": 5000, "description": "Alevins rigoureusement triés et vigoureux pour fermes aquacoles"}
                ]
            },
            {
                "name": "Pépinière & Plants Fruitiers",
                "icon": "🌱",
                "order": 3,
                "description": "Arbres fruitiers, palmiers et plants sélectionnés",
                "produits": [
                    {"name": "Plants de Noni", "price": 2000, "unit": "pièce", "stock": 100, "description": "Jeunes plants de Noni aux propriétés médicinales réputées"},
                    {"name": "Plants de Fruit de la passion", "price": 1500, "unit": "pièce", "stock": 80, "description": "Plants grimpants de passion très productifs"},
                    {"name": "Plants de Pomme cannelle", "price": 2000, "unit": "pièce", "stock": 60, "description": "Plants de pomme cannelle prêts à repiquer"},
                    {"name": "Plants de Baobab", "price": 2500, "unit": "pièce", "stock": 50, "description": "Jeunes baobabs greffés pour fructification précoce"},
                    {"name": "Plants de Truffe blanc", "price": 3000, "unit": "pièce", "stock": 40, "description": "Plants rares de truffe blanc"},
                    {"name": "Bananier & Cocotier sélectionné", "price": 2500, "unit": "pièce", "stock": 150, "description": "Rejets de bananiers et cocotiers nains haute production"},
                    {"name": "Pommier sauvage (Irvingia / Assro)", "price": 2000, "unit": "pièce", "stock": 70, "description": "Plants d'Irvingia gabonensis (Assro)"},
                    {"name": "Palmier local & sélectionné", "price": 3000, "unit": "pièce", "stock": 200, "description": "Plants de palmiers à huile sélectionnés haute performance"},
                    {"name": "Papayer sélectionné", "price": 1500, "unit": "pièce", "stock": 120, "description": "Papayers solo / hermaphrodites très sucrés"},
                    {"name": "Tangelo, Tangor & Mandarinier", "price": 3000, "unit": "pièce", "stock": 90, "description": "Agrumes greffés à haut rendement"},
                    {"name": "Citronnier & Manguier (Camerounaise)", "price": 3000, "unit": "pièce", "stock": 110, "description": "Plants greffés de citronnier et manguier spécial"},
                    {"name": "Avocatier greffé", "price": 3000, "unit": "pièce", "stock": 85, "description": "Avocatiers greffés à fructification rapide"}
                ]
            },
            {
                "name": "Plantes Aromatiques & Miel Pur",
                "icon": "🍯",
                "order": 4,
                "description": "Herbes aromatiques bio et miel d'abeilles d'exception",
                "produits": [
                    {"name": "Herbes aromatiques fraîches bio", "price": 1000, "unit": "sachet", "stock": 300, "description": "Menthe, Citronnelle, Céleri, Persil, Basilic, Thym, Romarin, Laurier cueillis du matin"},
                    {"name": "Fruits de Noni Bio frais", "price": 2500, "unit": "kg", "stock": 150, "description": "Fruits de Noni mûris naturellement à la ferme"},
                    {"name": "Miel pur d'abeilles (Cœur de Bambousiers)", "price": 5000, "unit": "bouteille (75cl)", "stock": 80, "description": "Miel rare récolté dans les ruches situées au cœur de nos bambouseraies"},
                    {"name": "Miel pur d'abeilles (Cœur de Palmiers)", "price": 5500, "unit": "bouteille (75cl)", "stock": 70, "description": "Miel ambré et parfumé récolté au cœur des palmeraies"}
                ]
            }
        ]

        for cat_data in categories_ferme_data:
            produits = cat_data.pop("produits")
            cat_obj, _ = CategorieFerme.objects.update_or_create(
                slug=slugify(cat_data["name"]),
                defaults=cat_data
            )
            for prod in produits:
                ProduitFerme.objects.update_or_create(
                    categorie=cat_obj,
                    slug=slugify(prod["name"]),
                    defaults={
                        "name": prod["name"],
                        "price": prod["price"],
                        "unit": prod["unit"],
                        "stock": prod["stock"],
                        "description": prod["description"],
                        "is_active": True,
                        "is_featured": True
                    }
                )
        self.stdout.write(self.style.SUCCESS("✓ Ferme & Pépinière initialisées avec succès !"))

        # =========================================================================
        # 2. RESTAURATION & MENUS
        # =========================================================================
        categories_menu_data = [
            {
                "name": "Entrées, Snacking & Brochettes",
                "icon": "🍢",
                "order": 1,
                "plats": [
                    {
                        "name": "Brochettes spéciales (Gambas, Poulet, Poisson, Viande)",
                        "price": 2500,
                        "description": "Brochettes tendres mariné aux épices du jardin et grillées au feu de bois",
                        "options_disponibles": {"Viande": ["Gambas", "Poulet fermier", "Poisson", "Viande de mouton"]}
                    },
                    {
                        "name": "Fataya croustillant (Viande ou Poulet)",
                        "price": 1500,
                        "description": "Chaussons dorés et croustillants garnis à la viande hachée ou au poulet",
                        "options_disponibles": {"Garniture": ["Viande hachée", "Poulet haché"]}
                    },
                    {
                        "name": "Nêm à la viande maison",
                        "price": 1500,
                        "description": "Nêms faits maison servis avec sauce aigre-douce et feuilles de menthe",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Lasagne spécial maison",
                        "price": 3500,
                        "description": "Lasagnes gratinées garnies de sauce viande mijotée et fromage fondu",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Vermicelle chinois à la boulette de viande",
                        "price": 3000,
                        "description": "Vermicelles sautés aux légumes croquants et boulettes de viande",
                        "options_disponibles": {}
                    }
                ]
            },
            {
                "name": "Spécialités, Grillades & Méchouis",
                "icon": "🔥",
                "order": 2,
                "plats": [
                    {
                        "name": "Sauté de crabe rouge + Accompagnement",
                        "price": 4500,
                        "description": "Crabes rouges sautés à la sauce tomate épicée, accompagnés de Piron ou Akassa",
                        "options_disponibles": {"Accompagnement": ["Piron rouge", "Piron blanc", "Akassa (Maïs)"]}
                    },
                    {
                        "name": "Souris d'agneau braisée + Purée",
                        "price": 7000,
                        "description": "Souris d'agneau confite aux herbes aromatiques, servie avec purée maison",
                        "options_disponibles": {"Purée": ["Purée de pommes de terre", "Purée de patates douces"]}
                    },
                    {
                        "name": "Steak ou Côtelette de mouton grillé",
                        "price": 6000,
                        "description": "Côtelettes de mouton mariné 24h, grillé au barbecue avec frites croustillantes",
                        "options_disponibles": {"Frites": ["Frites d'Alloco (Plantain)", "Frites de pomme de terre"]}
                    },
                    {
                        "name": "Poisson à la vapeur avec légumes du jardin",
                        "price": 5000,
                        "description": "Poisson frais cuit à la vapeur avec assortiment de légumes de notre pépinière",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Volailles Farcies (Pintade, Caille, Poulet)",
                        "price": 6500,
                        "description": "Volaille entière rôtie et farcie aux herbes aromatiques et champignons",
                        "options_disponibles": {"Choix de Volaille": ["Pintade farcie", "Caille farcie", "Poulet farci"]}
                    },
                    {
                        "name": "Méchoui d'exception (Dinde ou Mouton)",
                        "price": 12000,
                        "description": "Méchoui traditionnel rôti à la broche au feu de bois pendant plusieurs heures",
                        "options_disponibles": {"Viande": ["Méchoui de Dinde entière", "Méchoui de Mouton (Quartier)"]}
                    },
                    {
                        "name": "Braisés gourmands (Tilapia, Poulet, Caille, Lapin, Pintade)",
                        "price": 5500,
                        "description": "Grillades braisées servies avec marinade pimentée maison et oignons caramélisés",
                        "options_disponibles": {"Viande/Poisson": ["Tilapia braisé", "Poulet braisé", "Caille braisée", "Lapin braisé", "Pintade braisée"]}
                    }
                ]
            },
            {
                "name": "Plats de Riz & Couscous",
                "icon": "🍚",
                "order": 3,
                "plats": [
                    {
                        "name": "Couscous Riz + Moringa + Poisson",
                        "price": 3500,
                        "description": "Couscous de riz aux feuilles de moringa bio servi avec darne de poisson braisé",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Couscous Wassa Wassa (Igname séché)",
                        "price": 4000,
                        "description": "Couscous traditionnel d'igname séché servi avec friture pimentée et viande au choix",
                        "options_disponibles": {"Viande": ["Poisson braisé", "Lapin de ferme", "Caille grillée"]}
                    },
                    {
                        "name": "Couscous Millet + Sauce Macédoine",
                        "price": 4500,
                        "description": "Couscous de millet nutritif accompagné de légumes et d'une viande noble",
                        "options_disponibles": {"Viande": ["Lapin de ferme", "Caille grillée", "Pintade braisée"]}
                    },
                    {
                        "name": "Couscous Manioc (Attiéké garni)",
                        "price": 3500,
                        "description": "Attiéké frais de Côte d'Ivoire servi avec oignons, tomates fraiches et viande au choix",
                        "options_disponibles": {"Viande": ["Poulet fermier braisé", "Caille grillée"]}
                    },
                    {
                        "name": "Riz gras blanc garni aux viandes nobles",
                        "price": 3500,
                        "description": "Riz parfumé mijoté au jus de cuisson de viande garni au choix",
                        "options_disponibles": {"Garniture": ["Lapin sauté", "Caille rôtie"]}
                    },
                    {
                        "name": "Yassa traditionnel (Poulet ou Poisson)",
                        "price": 3500,
                        "description": "Poulet ou poisson mariné au citron vert et abondance d'oignons caramélisés",
                        "options_disponibles": {"Protéine": ["Poulet yassa", "Poisson yassa"]}
                    },
                    {
                        "name": "Thièpe Djène sénégalais (Rouge ou Blanc)",
                        "price": 3500,
                        "description": "Riz sénégalais mijoté aux légumes frais et mérou/capitaine",
                        "options_disponibles": {"Variante": ["Thièpe Djène Rouge", "Thièpe Djène Blanc"]}
                    },
                    {
                        "name": "Thièpe Yappe (Caille ou Lapin)",
                        "price": 4000,
                        "description": "Thièpe à la viande mijotée et légumes de saison",
                        "options_disponibles": {"Viande": ["Caille braisée", "Lapin braisé"]}
                    },
                    {
                        "name": "Riz sauce Mafé (Arachide)",
                        "price": 3000,
                        "description": "Riz blanc servi avec onctueuse sauce à la pâte d'arachide bio",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Riz cantonnais à la béninoise",
                        "price": 3000,
                        "description": "Riz sauté aux petites crevettes, petits pois, œufs et dés de poulet",
                        "options_disponibles": {}
                    },
                    {
                        "name": "Atassi traditionnel + friture + poisson",
                        "price": 2500,
                        "description": "Mélange riz et haricots rouges servi avec friture pimentée et poisson",
                        "options_disponibles": {}
                    }
                ]
            },
            {
                "name": "Pâtes & Plats Traditionnels",
                "icon": "🍲",
                "order": 4,
                "plats": [
                    {
                        "name": "Pâte rouge (Amiwo) spéciale",
                        "price": 3500,
                        "description": "Amiwo de maïs préparé au bouillon aromatisé avec piment et viande grillée",
                        "options_disponibles": {"Viande": ["Poulet fermier", "Lapin sauté", "Caille braisée"]}
                    },
                    {
                        "name": "Pâte (Bomiwo) raffinée",
                        "price": 3500,
                        "description": "Pâte Bomiwo traditionnelle servie chaude avec friture et viande au choix",
                        "options_disponibles": {"Viande": ["Poulet fermier", "Lapin sauté", "Caille braisée"]}
                    },
                    {
                        "name": "Piron (Rouge ou Blanc) gourmand",
                        "price": 3500,
                        "description": "Piron de gari de manioc préparé au jus de poisson ou de viande épicé",
                        "options_disponibles": {"Viande/Poisson": ["Poulet braisé", "Lapin sauté", "Caille grillée", "Poisson braisé"]}
                    },
                    {
                        "name": "Sélecteur de Pâtes de base traditionnelles",
                        "price": 2000,
                        "description": "Accompagnement de pâte traditionnelle locale au choix",
                        "options_disponibles": {"Type de Pâte": ["Akassa (Maïs)", "Télibo (Igname séché)", "Agbeli (Manioc)", "Semoule de blé", "Piron blanc"]}
                    }
                ]
            },
            {
                "name": "Sauces & Soupes",
                "icon": "🥣",
                "order": 5,
                "plats": [
                    {
                        "name": "Sauce feuilles maison (Moringa, Noni, Baobab...)",
                        "price": 2000,
                        "description": "Sauces préparées à partir de légumes bio fraîchement cueillis à la ferme",
                        "options_disponibles": {"Feuille au choix": ["Moringa", "Noni", "Baobab", "Basilic légume", "Vernonia (Fanti)", "Amarante (Gboma)"]}
                    },
                    {
                        "name": "Sauce Kpêtê (Mouton ou Lapin braisé)",
                        "price": 3000,
                        "description": "Sauce Kpêtê traditionnelle onctueuse avec viande braisée",
                        "options_disponibles": {"Viande": ["Mouton braisé", "Lapin braisé"]}
                    },
                    {
                        "name": "Sauces traditionnelles au choix",
                        "price": 2000,
                        "description": "Sauces béninoises riches en saveurs préparées dans la tradition",
                        "options_disponibles": {"Sauce": ["Sauce Cajou", "Sauce Aubergine", "Sauce Adidon (gluante)", "Sauce Djan (poisson frais)", "Sauce Chayo (basilic moulu)", "Sauce Arachide", "Sauce Tomate", "Sauce Graine", "Sauce Sésame"]}
                    },
                    {
                        "name": "Soupe Spéciale & Pepper Soup",
                        "price": 3500,
                        "description": "Soupe épicée et réconfortante préparée avec nos poissons ou mouton",
                        "options_disponibles": {"Soupe": ["Soupe Tête de mouton", "Pepper soup Clarias", "Soupe de Tilapia", "Soupe de Pengasius"]}
                    }
                ]
            },
            {
                "name": "Tubercules Sautés, Salades & Pizzas",
                "icon": "🍕",
                "order": 6,
                "plats": [
                    {
                        "name": "Tubercules sautés du jardin",
                        "price": 2000,
                        "description": "Portion de tubercules locaux dorés à la poêle et assaisonnés",
                        "options_disponibles": {"Tubercule": ["Patate douce", "Igname frites", "Taro sauté", "Manioc braisé"]}
                    },
                    {
                        "name": "Salades fraîches & composées",
                        "price": 2500,
                        "description": "Salades croquantes préparées à la commande",
                        "options_disponibles": {"Salade": ["Salade fraîcheur maison", "Salade d'haricot vert (Poisson/Poulet)", "Salade Niçoise"]}
                    },
                    {
                        "name": "Pizzas artisanales Saveurs d'Agojie",
                        "price": 5000,
                        "description": "Pizza cuite au feu de bois avec garnitures locales généreuses",
                        "options_disponibles": {"Pizza": ["Exotique (Poulet/Lapin)", "Margherita classique", "Spéciale maison Saveurs d'Agojie"]}
                    }
                ]
            }
        ]

        for cat_data in categories_menu_data:
            plats = cat_data.pop("plats")
            cat_obj, _ = CategorieMenu.objects.update_or_create(
                slug=slugify(cat_data["name"]),
                defaults=cat_data
            )
            for plat in plats:
                Plat.objects.update_or_create(
                    categorie=cat_obj,
                    slug=slugify(plat["name"]),
                    defaults={
                        "name": plat["name"],
                        "price": plat["price"],
                        "description": plat["description"],
                        "options_disponibles": plat["options_disponibles"],
                        "is_active": True,
                        "is_featured": True
                    }
                )
        self.stdout.write(self.style.SUCCESS("✓ Carte des plats initialisée avec succès !"))

        # =========================================================================
        # 3. BOISSONS & DESSERTS
        # =========================================================================
        boissons_data = [
            {"name": "Jus de fruits pressés à froid (Agrumes / Mandarine)", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Agrumes et mandarines de notre pépinière pressés sans eau ni sucre ajouté"},
            {"name": "Jus de Baobab naturel", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Jus onctueux de pulpe de baobab riche en vitamine C"},
            {"name": "Jus d'Ananas frais", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Jus d'ananas pain de sucre de Allada pressé"},
            {"name": "Jus de Bissap (Fleur d'Hibiscus)", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Infusion rafraîchissante de fleurs de bissap à la menthe"},
            {"name": "Jus de Corossol bio", "price": 2000, "type_boisson": TypeBoisson.JUS, "description": "Nectar délicat et velouté de corossol frais"},
            {"name": "Jus de Pomme cannelle + Gingembre", "price": 2000, "type_boisson": TypeBoisson.JUS, "description": "Mélange exotique et relevé au gingembre de la ferme"},
            {"name": "Citronnade artisanale", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Citronnade fraîche au miel de bambousier"},
            {"name": "Jus de Mil au gingembre (Ngbô)", "price": 1500, "type_boisson": TypeBoisson.JUS, "description": "Boisson traditionnelle béninoise rafraîchissante"},
            {"name": "Salade de fruits frais maison", "price": 2000, "type_boisson": TypeBoisson.DESSERT, "description": "Cocktail de fruits de saison (Mangue, Papaye, Ananas, Passiflore, Noni)"},
            {"name": "Dêguê traditionnel (Mil ou Blé)", "price": 1500, "type_boisson": TypeBoisson.DESSERT, "description": "Dessert onctueux au grumeaux de mil ou blé et yaourt frais"},
            {"name": "Crème glacée maison (Fleur d'oranger, Pomme cannelle, Basilic, Baobab, Jasmin)", "price": 2000, "type_boisson": TypeBoisson.DESSERT, "description": "Crème glacée artisanale réalisée avec nos arômes naturels"}
        ]

        for b_data in boissons_data:
            Boisson.objects.update_or_create(
                slug=slugify(b_data["name"]),
                defaults={
                    "name": b_data["name"],
                    "price": b_data["price"],
                    "type_boisson": b_data["type_boisson"],
                    "description": b_data["description"],
                    "is_active": True
                }
            )

        self.stdout.write(self.style.SUCCESS("✓ Boissons et desserts initialisés avec succès !"))
        self.stdout.write(self.style.SUCCESS("=== TOUTES LES DONNÉES ONT ÉTÉ CHARGÉES DANS LA BASE ! ==="))
