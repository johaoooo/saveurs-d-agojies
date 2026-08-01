import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CategorieFerme, ProduitFerme, Plat } from '../../models/produit.model';
import { PanierService } from '../../services/panier.service';
import { resolveFermeCategoryImage, resolveFermeImage, produitImage } from '../../utils/image-resolver';

@Component({
  selector: 'app-ferme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ferme.component.html',
  styleUrl: './ferme.component.css',
})
export class FermeComponent implements OnInit {
  activeCategorie = signal<string>('tous');
  searchTerm = signal<string>('');
  loading = signal(true);

  previewModal = signal<{ open: boolean; image: string; title: string; description: string }>({
    open: false,
    image: '',
    title: '',
    description: '',
  });

  openPreview(image: string, title: string, description: string): void {
    this.previewModal.set({
      open: true,
      image,
      title,
      description,
    });
  }

  closePreview(): void {
    this.previewModal.update((state) => ({ ...state, open: false }));
  }

  categories = signal<CategorieFerme[]>([
    { id: 0, name: 'Tous', slug: 'tous', icon: '⊞', image: 'assets/images/ferme-animaux.jpg', description: 'Tous les produits de la ferme' },
    { id: 1, name: 'Élevage & Oiseaux', slug: 'elevage-oiseaux', icon: '🐓', image: 'assets/images/volaille.jpg', description: 'Volailles, petits élevages et herbivores' },
    { id: 2, name: 'Pisciculture', slug: 'pisciculture', icon: '🐟', image: 'assets/images/poisson.jpg', description: 'Poissons marchands et alevins (Clarias, Tilapia)' },
    { id: 3, name: 'Pépinière & Arbres Fruitiers', slug: 'pepiniere-arbres-fruitiers', icon: '🌱', image: 'assets/images/plants.jpg', description: 'Plants d\'arbres fruitiers et végétaux sélectionnés' },
    { id: 4, name: 'Plantes Aromatiques & Miel Pur', slug: 'plantes-aromatiques-miel-pur', icon: '🍯', image: 'assets/images/miel.jpg', description: 'Herbes aromatiques bio et miels rares' },
  ]);

  produits = signal<ProduitFerme[]>([]);

  constructor(
    private apiService: ApiService,
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.apiService.getCategoriesFerme().subscribe((cats) => {
      if (cats && cats.length > 0) {
        this.categories.set([
          { id: 0, name: 'Tous', slug: 'tous', icon: '⊞', image: 'assets/images/ferme-animaux.jpg' },
          ...cats.map((c) => ({ ...c, image: c.image || resolveFermeCategoryImage(c.slug) })),
        ]);
      }
    });

    this.apiService.getProduitsFerme().subscribe((list) => {
      if (list && list.length > 0) {
        this.produits.set(list.map((p) => ({
          ...p,
          image: p.image || produitImage(p.slug) || resolveFermeImage(p.name),
        })));
      } else {
        this.produits.set(this.getFallbackProduits());
      }
      this.loading.set(false);
    });
  }

  get filteredProduits(): ProduitFerme[] {
    const slug = this.activeCategorie();
    const term = this.searchTerm().trim().toLowerCase();
    return this.produits().filter((p: any) => {
      const inCategorie = slug === 'tous' || p.categorie_slug === slug || (p.categorie && p.categorie.slug === slug);
      if (!inCategorie) return false;
      if (!term) return true;
      const text = `${p.name} ${p.description} ${p.unit || ''}`.toLowerCase();
      return text.includes(term);
    });
  }

  setCategorie(slug: string): void {
    this.activeCategorie.set(slug);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  commanderProduit(prod: ProduitFerme): void {
    const platItem: Plat = {
      id: prod.id + 1000,
      name: prod.name || (prod as any).nom,
      description: `${prod.description} (${prod.unit || (prod as any).unite})`,
      price: prod.price !== undefined ? prod.price : (prod as any).prix || 0,
      image: prod.image || '',
      is_active: true,
    };
    this.panierService.addItem(platItem);
  }

  private getFallbackProduits(): ProduitFerme[] {
    return [
      { id: 1, slug: 'oies-de-chine-souche-pure', name: 'Oies de Chine (souche pure)', price: 15000, unit: 'pièce', description: 'Oies de Chine de race pure, élevées en plein air', bio: true, image: 'assets/images/produits/oies-de-chine-souche-pure.jpg' },
      { id: 2, slug: 'pintades-pintadeaux', name: 'Pintades & Pintadeaux', price: 5000, unit: 'pièce', description: 'Pintades de ferme réputées pour leur chair savoureuse', bio: true, image: 'assets/images/produits/pintades-pintadeaux.jpg' },
      { id: 3, slug: 'dindes-bronze-damerique-dindonneaux', name: 'Dindes (Bronzé d\'Amérique) & Dindonneaux', price: 18000, unit: 'pièce', description: 'Dindes de grande taille élevées au grain', bio: true, image: 'assets/images/produits/dindes-bronze-damerique-dindonneaux.jpg' },
      { id: 4, slug: 'poulets-poussins-goliath', name: 'Poulets & Poussins Goliath', price: 4500, unit: 'pièce', description: 'Poulets Goliath vigoureux et à croissance rapide', bio: true, image: 'assets/images/produits/poulets-poussins-goliath.jpg' },
      { id: 5, slug: 'mouton-race-bali-bali-race-peulh', name: 'Mouton Race Bali Bali (Race Peulh)', price: 65000, unit: 'pièce', description: 'Mouton Bali Bali de grande stature pour élevage et festivités', bio: true, image: 'assets/images/produits/mouton-race-bali-bali-race-peulh.jpg' },
      { id: 6, slug: 'poissons-clarias-poisson-chat', name: 'Poissons Clarias (Poisson-chat)', price: 3500, unit: 'kg', description: 'Clarias frais issus de nos bassins aquacoles', bio: true, image: 'assets/images/produits/poissons-clarias-poisson-chat.jpg' },
      { id: 7, slug: 'poissons-tilapia-frais', name: 'Poissons Tilapia frais', price: 3000, unit: 'kg', description: 'Tilapia de qualité supérieure nourri bio', bio: true, image: 'assets/images/produits/poissons-tilapia-frais.jpg' },
      { id: 8, slug: 'alevins-selectionnes-clarias-tilapia-pengasius', name: 'Alevins sélectionnés (Clarias / Tilapia)', price: 150, unit: 'pièce', description: 'Alevins rigoureusement triés et vigoureux pour pisciculture', bio: true, image: 'assets/images/produits/alevins-selectionnes-clarias-tilapia-pengasius.jpg' },
      { id: 9, slug: 'plants-de-noni', name: 'Plants de Noni', price: 2000, unit: 'pièce', description: 'Jeunes plants de Noni aux propriétés médicinales réputées', bio: true, image: 'assets/images/produits/plants-de-noni.jpg' },
      { id: 10, slug: 'bananier-cocotier-selectionne', name: 'Bananier & Cocotier sélectionné', price: 2500, unit: 'pièce', description: 'Rejets de bananiers et cocotiers nains haute production', bio: true, image: 'assets/images/produits/bananier-cocotier-selectionne.jpg' },
      { id: 11, slug: 'palmier-local-selectionne', name: 'Palmier local & sélectionné', price: 3000, unit: 'pièce', description: 'Plants de palmiers à huile sélectionnés haute performance', bio: true, image: 'assets/images/produits/palmier-local-selectionne.jpg' },
      { id: 12, slug: 'miel-pur-dabeilles-cur-de-bambousiers', name: 'Miel pur d\'abeilles (Cœur de Bambousiers)', price: 5000, unit: 'bouteille (75cl)', description: 'Miel rare récolté dans les ruches situées au cœur de nos bambouseraies', bio: true, image: 'assets/images/produits/miel-pur-dabeilles-cur-de-bambousiers.jpg' },
      { id: 13, slug: 'miel-pur-dabeilles-cur-de-palmiers', name: 'Miel pur d\'abeilles (Cœur de Palmiers)', price: 5500, unit: 'bouteille (75cl)', description: 'Miel ambré et parfumé récolté au cœur des palmeraies', bio: true, image: 'assets/images/produits/miel-pur-dabeilles-cur-de-palmiers.jpg' }
    ];
  }
}
