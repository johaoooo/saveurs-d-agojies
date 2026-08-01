# Saveurs d'Agojie

Plateforme web multi-services — Ferme, Restauration & Traiteur

## Structure

```
saveurs-d-agojie/
├── frontend/          # Angular 19 (Standalone)
├── backend/           # Django REST Framework + PostgreSQL
├── produits-services.txt
└── cahier-des-charges.md
```

## Installation

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## Charte graphique

- **Blanc** (#FFFFFF) — fond
- **Jaune** (#FFCC00 / #E6B800) — accents, titres, CTA
- **Anthracite** (#0A0A0C) — textes, sections sombres
