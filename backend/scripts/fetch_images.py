#!/usr/bin/env python3
"""Télécharge une photo unique et adaptée à chaque produit depuis Wikimedia Commons.

Usage:
    python scripts/fetch_images.py            # tous les produits
    python scripts/fetch_images.py --dry-run  # affiche les recherches sans télécharger
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request

import requests

API = "http://localhost:8000/api"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "images", "produits")
WIKI = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "SaveursDAgojieImageFetcher/1.0 (contact: admin@agojie.local)"

REQUIRED_MIN_WIDTH = 500

EXCLUDE_WORDS = [
    "logo", "icon", "flag", "map", "diagram", "screenshot", "svg",
    "wappen", "coat of arms", "seal", "stamp", "text",
]


def fetch_results(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_commons(query, used_titles):
    """Cherche sur Commons et retourne une liste de candidats (titre, url, width)."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 6,
        "gsrlimit": 20,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": 1000,
    }
    url = WIKI + "?" + urllib.parse.urlencode(params)
    data = fetch_results(url)
    pages = (data.get("query") or {}).get("pages") or {}
    candidates = []
    for page in pages.values():
        title = page.get("title", "")
        info = (page.get("imageinfo") or [{}])[0]
        mime = info.get("mime", "")
        if mime not in ("image/jpeg", "image/png"):
            continue
        if any(w in title.lower() for w in EXCLUDE_WORDS):
            continue
        if title in used_titles:
            continue
        width = info.get("width") or 0
        if width < REQUIRED_MIN_WIDTH:
            continue
        url = info.get("thumburl") or info.get("url")
        if not url:
            continue
        candidates.append({"title": title, "url": url, "width": width})
    return candidates


def build_queries(name, kind):
    """Génère plusieurs requêtes de recherche pour un produit, du plus précis au plus général."""
    clean = name.split("(")[0].split("+")[0].strip()
    base = re.sub(r"[^A-Za-z0-9À-ÿ\s'-]", " ", clean).strip()
    lowered = base.lower()

    # Mots-clés de validation : le titre Commons doit en contenir un pour être accepté
    validators = []

    # Mots-clés de recherche par produit
    extra_queries = []
    for word, keys in {
        "miel": (["honey"], ["honey", "miel", "ruche", "beehive"]),
        "noni": (["noni fruit"], ["noni", "morinda"]),
        "herbe": (["fresh herbs", "herbs"], ["herb", "herbs", "herbe"]),
        "avocatier": (["avocado tree"], ["avocado", "avocat"]),
        "citronnier": (["citrus tree lemon"], ["lemon", "citron", "citrus"]),
        "manguier": (["mango tree"], ["mango", "mangue"]),
        "papayer": (["papaya tree"], ["papaya", "papaye"]),
        "palmier": (["date palm tree", "oil palm tree"], ["palm tree", "palmier", "date palm", "oil palm"]),
        "pommier": (["apple tree"], ["apple", "pomme"]),
        "bananier": (["banana tree"], ["banana", "bananier"]),
        "cocotier": (["coconut tree"], ["coconut", "cocotier", "coconut tree"]),
        "truffe": (["truffle"], ["truffle", "truffe"]),
        "baobab": (["baobab tree"], ["baobab"]),
        "passion": (["passion fruit"], ["passion fruit", "fruit de la passion"]),
        "cannelle": (["custard apple"], ["custard apple", "pomme cannelle", "sugar apple"]),
        "tangelo": (["tangelo citrus"], ["tangelo", "tangor", "citrus", "mandarin"]),
        "mandarinier": (["mandarin tree"], ["mandarin", "tangerine", "citrus"]),
        "poisson": (["fresh fish"], ["fish", "poisson"]),
        "alevin": (["fish fry fingerlings"], ["fish", "alevin", "fingerling"]),
        "tilapia": (["tilapia"], ["tilapia"]),
        "poulet": (["grilled chicken", "chicken"], ["chicken", "poulet"]),
        "pintade": (["guineafowl"], ["guineafowl", "guinea fowl", "pintade"]),
        "dinde": (["turkey"], ["turkey", "dinde"]),
        "oie": (["goose"], ["goose", "oie"]),
        "poussin": (["chick"], ["chick", "poussin", "chicken"]),
        "canard": (["duck"], ["duck", "canard"]),
        "caille": (["quail"], ["quail", "caille"]),
        "mouton": (["sheep"], ["sheep", "mouton", "ram"]),
        "chèvre": (["goat"], ["goat", "chèvre", "chevre"]),
        "agneau": (["lamb"], ["lamb", "agneau"]),
        "bœuf": (["cattle"], ["cattle", "cow", "boeuf"]),
        "œuf": (["eggs"], ["egg", "eggs", "oeuf"]),
        "volaille": (["poultry"], ["chicken", "poultry", "volaille"]),
        "brochette": (["skewer kebab"], ["skewer", "kebab", "brochette", "satay"]),
        "couscous": (["couscous"], ["couscous"]),
        "ananas": (["pineapple"], ["pineapple", "ananas"]),
        "pizza": (["pizza"], ["pizza"]),
        "crevette": (["shrimp"], ["shrimp", "crevette", "prawn"]),
        "gambas": (["king prawn"], ["shrimp", "prawn", "gambas"]),
        "crabe": (["crab"], ["crab", "crabe"]),
        "riz": (["rice dish"], ["rice", "riz"]),
        "glace": (["ice cream"], ["ice cream", "glace"]),
        "jus": (["fruit juice"], ["juice", "jus"]),
        "salade": (["salad"], ["salad", "salade"]),
        "soupe": (["soup"], ["soup", "soupe"]),
        "sauce": (["sauce"], ["sauce", "sauce dish"]),
        "feuille": (["leafy greens"], ["leaf", "feuille", "greens", "spinach"]),
        "moringa": (["moringa"], ["moringa"]),
        "épinard": (["spinach"], ["spinach", "épinard", "epinard"]),
        "basilic": (["basil"], ["basil", "basilic"]),
        "igname": (["yam"], ["yam", "igname"]),
        "manioc": (["cassava"], ["cassava", "manioc"]),
        "millet": (["millet"], ["millet"]),
        "banane": (["banana"], ["banana", "banane"]),
        "mangue": (["mango"], ["mango", "mangue"]),
        "papaye": (["papaya"], ["papaya", "papaye"]),
        "citron": (["lemon"], ["lemon", "citron"]),
        "mandarine": (["mandarin"], ["mandarin", "mandarine"]),
        "orange": (["orange fruit"], ["orange", "agrume"]),
        "tomate": (["tomato"], ["tomato", "tomate"]),
        "lasagne": (["lasagna"], ["lasagna", "lasagne"]),
        "pâtes": (["pasta"], ["pasta", "pates"]),
        "nêm": (["spring rolls"], ["spring roll", "nems", "nem"]),
        "vermicelle": (["rice noodles"], ["noodle", "vermicelle", "vermicelli"]),
        "yassa": (["chicken yassa"], ["yassa", "chicken"]),
        "amiwo": (["corn dough"], ["corn", "amiwo", "maize"]),
        "piron": (["gari"], ["gari", "cassava"]),
        "attiéké": (["attieke"], ["attieke", "attiéké", "cassava"]),
        "abodé": (["grilled fish"], ["fish", "abodé", "abode"]),
        "gboassa": (["grilled beef"], ["beef", "gboassa"]),
        "thièpe": (["senegalese rice"], ["rice", "thièpe", "thiepe"]),
        "mafé": (["groundnut stew"], ["groundnut", "mafé", "mafe", "peanut stew"]),
        "bissap": (["hibiscus tea"], ["hibiscus", "bissap"]),
        "corossol": (["soursop"], ["soursop", "corossol", "graviola"]),
        "dêguê": (["millet yogurt"], ["dégué", "degué", "millet", "yogurt"]),
        "gingembre": (["ginger"], ["ginger", "gingembre"]),
        "kêtê": (["pepper soup"], ["soup", "pepper soup"]),
        "jardin": (["vegetables garden"], ["vegetable", "garden", "légume"]),
        "plant": (["seedling"], ["seedling", "plant", "nursery", "semis"]),
        "arbuste": (["shrub"], ["shrub", "arbuste"]),
        "fruit": (["fruit"], ["fruit", "fruits"]),
    }.items():
        if word in lowered:
            q, v = keys
            extra_queries.append(q)
            validators.extend(v)

    queries = []
    # 1. nom seul + mot-clé dédié (le plus précis)
    for q in extra_queries:
        queries.append((f"{base} {q}", validators))
    # 2. nom seul
    queries.append((base, validators or [base.lower()]))
    # 3. mot-clé seul
    for q in extra_queries:
        queries.append((q, validators))
    # 4. fallback générique
    queries.append(("african food", ["food", "cuisine"]))
    queries.append(("food dish", ["food", "dish", "plat"]))

    return queries


def title_matches(title, validators):
    """Le titre de l'image doit contenir au moins un mot-clé de validation."""
    if not validators:
        return True
    t = title.lower()
    return any(v in t for v in validators)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="Nombre max de produits (test)")
    args = parser.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)

    # Récupère tous les produits depuis l'API locale
    items = []
    for endpoint, kind in [
        ("/ferme/produits/", "ferme"),
        ("/menu/plats/", "plat"),
        ("/menu/boissons/", "boisson"),
    ]:
        page = 1
        while True:
            r = requests.get(f"{API}{endpoint}", params={"page": page, "page_size": 100}, timeout=15)
            if r.status_code != 200:
                break
            data = r.json()
            results = data.get("results", data if isinstance(data, list) else [])
            for item in results:
                items.append({"kind": kind, "slug": item["slug"], "name": item["name"], "id": item["id"]})
            if not data.get("next"):
                break
            page += 1

    if args.limit:
        items = items[: args.limit]

    used_titles = set()
    results = []
    for item in items:
        image_path = os.path.join(OUT_DIR, f"{item['slug']}.jpg")
        exists = os.path.exists(image_path)
        if exists and not args.dry_run:
            results.append({"slug": item["slug"], "status": "exist", "image": image_path})
            continue

        chosen = None
        for query, validators in build_queries(item["name"], item["kind"]):
            try:
                candidates = search_commons(query, used_titles)
            except Exception as e:
                print(f"  [warn] recherche '{query}' échouée : {e}", file=sys.stderr)
                candidates = []
            # On accepte le premier candidat dont le titre valide les mots-clés
            chosen = next((c for c in candidates if title_matches(c["title"], validators)), None)
            if chosen:
                break

        if not chosen:
            results.append({"slug": item["slug"], "status": "no-result", "query": query})
            print(f"{item['kind']:7s} | {item['name']:<60s} | AUCUN RÉSULTAT")
            continue

        used_titles.add(chosen["title"])
        if args.dry_run:
            print(f"{item['kind']:7s} | {item['name']:<60s} | {chosen['title'][:70]}")
            results.append({"slug": item["slug"], "status": "dry", "title": chosen["title"]})
            continue

        try:
            req = urllib.request.Request(chosen["url"], headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=60) as resp:
                img = resp.read()
            with open(image_path, "wb") as f:
                f.write(img)
            print(f"{item['kind']:7s} | {item['name']:<60s} | OK -> {os.path.relpath(image_path)}")
            results.append({"slug": item["slug"], "status": "ok", "image": image_path})
        except Exception as e:
            print(f"  [warn] téléchargement échoué pour {item['name']}: {e}", file=sys.stderr)
            results.append({"slug": item["slug"], "status": "error"})

    ok = sum(1 for r in results if r["status"] in ("ok", "exist"))
    print(f"\nTerminé : {ok}/{len(results)} produits avec image, {len(used_titles)} images uniques téléchargées.")


if __name__ == "__main__":
    main()
