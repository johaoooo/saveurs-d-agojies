import { Injectable, computed, signal } from '@angular/core';
import { PanierItem, Plat } from '../models/produit.model';

@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly STORAGE_KEY = 'saveurs_agojie_panier';

  items = signal<PanierItem[]>(this.loadFromStorage());

  total = computed(() =>
    this.items().reduce((sum, item) => {
      const p = item.plat.price !== undefined ? item.plat.price : (item.plat.prix || 0);
      return sum + p * item.quantite;
    }, 0)
  );

  nombreArticles = computed(() =>
    this.items().reduce((count, item) => count + item.quantite, 0)
  );

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  private loadFromStorage(): PanierItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addItem(plat: Plat, options: Record<string, string> = {}): void {
    const normalizedPlat: Plat = {
      ...plat,
      name: plat.name || plat.nom || 'Produit',
      price: plat.price !== undefined ? plat.price : (plat.prix || 0)
    };

    this.items.update((items) => {
      const existing = items.find(
        (i) => i.plat.id === normalizedPlat.id && JSON.stringify(i.options) === JSON.stringify(options)
      );
      if (existing) {
        existing.quantite++;
      } else {
        items.push({ plat: normalizedPlat, quantite: 1, options });
      }
      this.saveToStorage();
      return [...items];
    });
  }

  removeItem(platId: number, options: Record<string, string> = {}): void {
    this.items.update((items) => {
      const filtered = items.filter(
        (i) => !(i.plat.id === platId && JSON.stringify(i.options) === JSON.stringify(options))
      );
      this.saveToStorage();
      return filtered;
    });
  }

  updateQuantity(platId: number, quantite: number, options: Record<string, string> = {}): void {
    this.items.update((items) => {
      const item = items.find(
        (i) => i.plat.id === platId && JSON.stringify(i.options) === JSON.stringify(options)
      );
      if (item) {
        item.quantite = Math.max(1, quantite);
      }
      this.saveToStorage();
      return [...items];
    });
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  genererMessageWhatsApp(): string {
    const items = this.items();
    if (items.length === 0) return '';

    let message = '*Commande Saveurs d\'Agojiés*%0A%0A';
    items.forEach((item, index) => {
      const name = item.plat.name || item.plat.nom || 'Produit';
      const price = item.plat.price !== undefined ? item.plat.price : (item.plat.prix || 0);
      message += `${index + 1}. *${name}* x${item.quantite}`;
      if (Object.keys(item.options).length > 0) {
        message += ` (${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')})`;
      }
      message += ` · ${(price * item.quantite).toLocaleString('fr-FR')} FCFA%0A`;
    });
    message += `%0A*Total: ${this.total().toLocaleString('fr-FR')} FCFA*`;
    return message;
  }
}
