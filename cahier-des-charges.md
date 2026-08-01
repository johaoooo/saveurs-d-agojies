# CAHIER DES CHARGES COMPLET : PLATAFORME WEB MULTI-SERVICES

## 1. PRÉSENTATION DU PROJET ET OBJECTIFS

### 1.1 Contexte
Le projet vise la création d'un site web vitrine et e-commerce moderne, élégant et réactif, regroupant les activités de l'entreprise :
- **La Ferme :** Élevage, Pisciculture, Pépinière, Plantes & Produits Naturels (Miel, Bio).
- **La Restauration :** Menus traiteur, grillades, spécialités locales et boissons artisanales.

### 1.2 Objectifs principaux
- Offrir une vitrine haut de gamme mettant en valeur la ferme et la carte de restauration.
- Permettre la commande en ligne de plats avec sélection personnalisée des viandes et accompagnements.
- Simplifier le parcours client par une validation directe via **WhatsApp** ou e-mail.
- Fournir une interface d'administration fluide et autonome pour la gestion des produits et des cartes.

## 2. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIE

### 2.1 Charte Graphique
- **Couleur Principale :** Blanc (#FFFFFF) – Fond, pureté, lisibilité et aération.
- **Couleur d'Accentuation :** Doré / Or (#D4AF37 / #C5A059) – Titres, boutons d'action (CTA), bordures, surbrillances et éléments chics.
- **Couleurs de Soutien :**
  - Gris très clair (#F8F9FA) – Fond des cartes produits et sections secondaires.
  - Anthracite / Noir (#1A1A1A) – Textes pour un contraste visuel optimal.
- **Style Visuel :** Épuré, moderne, orienté photo-produit, avec animations légères au survol.

### 2.2 Header (Barre de navigation)
Le header sera fixe (*sticky*) sur desktop et mobile, composé de :
- **Logo de l'entreprise** (À gauche)
- **Navigation principale** (Au centre) :
  1. **La Ferme** *(Élevage, Pisciculture, Pépinière, Miel)*
  2. **Notre Menu** *(Restauration, Grillades, Boissons, Desserts)*
  3. **À Propos** *(Histoire, Engagement qualité & bio)*
  4. **Contact** *(Formulaire, Coordonnées, Localisation)*
- **Module de Commande & Contact Rapide** (À droite) :
  - Icône Panier / Récapitulatif
  - Bouton d'accès direct **WhatsApp**

## 3. ARCHITECTURE TECHNIQUE ET STACK

Le projet repose sur une architecture découplée via API REST :

```
[ FRONT-END: Angular ] <---> [ API REST ] <---> [ BACK-END: Django / PostgreSQL ]
```

- **Front-End (Angular) :**
  - Application Mono-Page (SPA) rapide et dynamique.
  - Responsive design (Mobile First).
  - Gestion de l'état du panier en mémoire locale (*LocalStorage/RxJS*).
- **Back-End (Django & Django REST Framework) :**
  - API REST sécurisée pour le catalogue, les catégories et les commandes.
  - Panneau d'administration natif (*Django Admin*) personnalisé pour la mise à jour des contenus.
- **Base de Données :** PostgreSQL
- **Hébergement & Sécurité :** VPS Linux, Nginx, HTTPS (Certificat SSL Let's Encrypt).

## 4. DÉTAIL DES SECTIONS ET CONTENUS DU SITE

### 4.1 Section « LA FERME »
Présentation sous forme de catalogue filtrable ou fiches produits :
- **Élevage & Oiseaux :** Oies de Chine, Pintades, Dindes, Goliath, Poulets locaux/améliorés, Cailles, Cobayes, Lapins, Moutons (Bali Bali, Balami, Oudah), Chèvre rousse de Maradi.
- **Pisciculture :** Poissons adultes et alevins (Clarias, Tilapia, Pengasius, Bramar).
- **Pépinière & Plants :** Arbres fruitiers (Noni, Passiflore, Baobab, Truffe blanc, Bananier, Cocotier, Pommier sauvage, Palmier, Papayer, Tangelo, Tangor, Mandarinier, Citronnier, Manguier, Avocatier).
- **Plantes Aromatiques Bio & Miel :** Herbes fraîches (Menthe, Citronnelle, Céleri, Persil, Basilic, Thym, Romarin, Laurier, etc.), Miel pur de bambousiers et palmiers.

### 4.2 Section « NOTRE MENU » (Restauration)
Affichage interactif de la carte avec choix d'options :
1. **Entrées, Snacking & Brochettes :** Brochettes (Gambas, Poulet, Poisson, Viande), Fataya, Nêm, Lasagne maison, Vermicelle chinois.
2. **Spécialités, Grillades & Méchouis :** Sauté de crabe rouge, Souris d'agneau, Steak/Côtelette de mouton, Poisson vapeur, Farcies (Pintade, Caille, Poulet), Méchouis (Dinde, Mouton), Braisés (Tilapia, Poulet, Caille, Lapin, Pintade).
3. **Plats de Riz & Couscous :** Couscous (Riz moringa, Wassa wassa, Millet, Attiéké), Riz gras garni, Yassa, Thièpe Djène (Rouge/Blanc), Thièpe Yappe, Riz Mafé, Riz cantonnais, Atassi.
4. **Pâtes & Plats Traditionnels :** Amiwo, Bomiwo, Piron (Rouge/Blanc) avec sélecteur de viande/poisson, Pâtes de base (Akassa, Télibo, Agbeli, Semoule).
5. **Sauces & Soupes :** Sauces feuilles (Moringa, Noni, Baobab, Basilic, Vernonia, Amarante), Sauces traditionnelles (Kpêtê, Cajou, Aubergine, Adidon, Djan, Chayo, Arachide, Tomate, Graine, Sésame), Soupes (Tête de mouton, Pepper soup Clarias, Tilapia, Pengasius).
6. **Tubercules Sautés :** Patate douce, Igname, Taro, Manioc.
7. **Salades & Pizzas :** Salade fraîcheur, Haricot vert, Niçoise / Pizzas (Exotique, Margherita, Spéciale).
8. **Boissons & Desserts :** Jus pressés à froid (Agrumes, Mandarine), Jus artisanaux (Baobab, Ananas, Bissap, Corossol, Pomme cannelle + gingembre, Citronnade, Mil au gingembre), Desserts (Salade de fruits, Dêguê, Glaces artisanales : Fleur d'oranger, Pomme cannelle, Basilic, Baobab, Jasmin).

### 4.3 Section « À PROPOS »
- Présentation de la ferme, des valeurs agro-écologiques et de l'approche culinaire.
- Mise en avant des circuits courts (de la ferme à l'assiette).

### 4.4 Section « CONTACT »
- Formulaire de contact dynamique avec sélection du sujet (Restauration / Élevage / Pépinière / Traiteur).
- Coordonnées (Téléphone, Adresse à Porto-Novo).
- Carte interactive Google Maps.

## 5. SPÉCIFICATIONS FONCTIONNELLES & PARCOURS UTILISATEUR

1. **Sélection des options de plats (Angular Forms) :**
   - Pour les plats modulables (ex: *Pâte Amiwo* ou *Thièpe*), l'utilisateur choisit l'accompagnement ou la viande souhaitée (Poulet, Lapin, Caille, Poisson) via un menu de sélection intuitif.
2. **Panier & Envoi de commande :**
   - L'utilisateur consulte son récapitulatif.
   - Bouton **« Valider sur WhatsApp »** : Génère automatiquement un message structuré contenant la commande exacte et la redirige vers le numéro WhatsApp officiel.
   - Bouton **« Commander par Formulaire »** : Envoie la commande en base de données Django avec notification mail.

## 6. CALENDRIER DE RÉALISATION

- **Phase 1 – Conception & Design (Figma) :** Maquettes UX/UI aux tons Blanc & Doré.
- **Phase 2 – Back-End Django :** Modélisation de la base de données, création des endpoints API REST et configuration du panneau d'administration.
- **Phase 3 – Front-End Angular :** Intégration du Header, des composants de cartes, du sélecteur d'options et du panier WhatsApp.
- **Phase 4 – Recette & Mise en ligne :** Tests d'affichage mobile, sécurisation HTTPS et déploiement sur serveur.