#!/usr/bin/env python3
"""Optimise les images produits : recadrage 4:3, redimensionnement, compression JPEG.

Usage:
    python scripts/optimize_images.py
"""
import os
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "images", "produits")
MAX_WIDTH = 800
QUALITY = 78


def optimize(path):
    img = Image.open(path)
    img = img.convert("RGB")

    # Recadrage 4:3 centré
    w, h = img.size
    ratio = 4 / 3
    if w / h > ratio:
        new_w = int(h * ratio)
        x0 = (w - new_w) // 2
        img = img.crop((x0, 0, x0 + new_w, h))
    elif h / w > ratio:
        new_h = int(w / ratio)
        y0 = (h - new_h) // 2
        img = img.crop((0, y0, w, y0 + new_h))

    # Redimensionnement
    if img.width > MAX_WIDTH:
        img = img.resize((MAX_WIDTH, int(img.height * MAX_WIDTH / img.width)), Image.LANCZOS)

    img.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def main():
    total = 0
    for f in sorted(os.listdir(BASE)):
        if not f.endswith(".jpg"):
            continue
        path = os.path.join(BASE, f)
        before = os.path.getsize(path)
        try:
            optimize(path)
        except Exception as e:
            print(f"[warn] {f}: {e}")
            continue
        after = os.path.getsize(path)
        total += after
        print(f"{f[:60]:<62s} {before/1024:6.0f} Ko -> {after/1024:5.0f} Ko")
    print(f"\nTotal optimisé : {total/1024/1024:.1f} Mo")


if __name__ == "__main__":
    main()
