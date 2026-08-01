import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierService } from '../../services/panier.service';
import { ApiService } from '../../services/api.service';
import { Plat, Boisson, CategorieMenu } from '../../models/produit.model';
import { resolveBoissonImage, resolveMenuImage, produitImage } from '../../utils/image-resolver';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  activeCategorie = signal<string>('tous');
  searchTerm = signal<string>('');
  panierOuvert = signal(false);
  loading = signal(true);

  categories = signal<CategorieMenu[]>([
    { id: 0, name: 'Tous', slug: 'tous' },
    { id: 1, name: 'Entrées, Snacking & Brochettes', slug: 'entrees-snacking-brochettes' },
    { id: 2, name: 'Spécialités, Grillades & Méchouis', slug: 'specialites-grillades-mechouis' },
    { id: 3, name: 'Plats de Riz & Couscous', slug: 'plats-de-riz-couscous' },
    { id: 4, name: 'Pâtes & Plats Traditionnels', slug: 'pates-plats-traditionnels' },
    { id: 5, name: 'Sauces & Soupes', slug: 'sauces-soupes' },
    { id: 6, name: 'Tubercules Sautés, Salades & Pizzas', slug: 'tubercules-sautes-salades-pizzas' },
    { id: 7, name: 'Boissons Artisanales', slug: 'boissons-artisanales' },
    { id: 8, name: 'Desserts & Crèmes Glacées', slug: 'desserts-cremes-glacees' },
  ]);

  plats = signal<Plat[]>([]);
  boissons = signal<Boisson[]>([]);

  optionsSelectionnees: Record<number, Record<string, string>> = {};

  constructor(
    protected panierService: PanierService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.apiService.getCategoriesMenu().subscribe((cats) => {
      if (cats && cats.length > 0) {
        this.categories.set([{ id: 0, name: 'Tous', slug: 'tous' }, ...cats]);
      }
    });

    this.apiService.getPlats().subscribe((platList) => {
      if (platList && platList.length > 0) {
        this.plats.set(platList.map((p: any) => ({
          ...p,
          image: p.image || produitImage(p.slug) || resolveMenuImage(p.name),
        })));
      } else {
        this.plats.set(this.getFallbackPlats());
      }
      this.loading.set(false);
    });

    this.apiService.getBoissons().subscribe((boissonList) => {
      if (boissonList && boissonList.length > 0) {
        this.boissons.set(boissonList.map((b: any) => ({
          ...b,
          image: b.image || produitImage(b.slug) || resolveBoissonImage(b.name, b.type_boisson || ''),
        })));
      } else {
        this.boissons.set(this.getFallbackBoissons());
      }
    });
  }

  get filteredPlats(): Plat[] {
    const slug = this.activeCategorie();
    const term = this.searchTerm().trim().toLowerCase();
    if (slug === 'boissons-artisanales' || slug === 'desserts-cremes-glacees') return [];
    return this.plats().filter((p: any) => {
      const inCategorie = slug === 'tous' || p.categorie_slug === slug || (p.categorie && p.categorie.slug === slug);
      if (!inCategorie) return false;
      if (!term) return true;
      const text = `${p.name} ${p.description}`.toLowerCase();
      return text.includes(term);
    });
  }

  get filteredBoissons(): Boisson[] {
    const slug = this.activeCategorie();
    const term = this.searchTerm().trim().toLowerCase();
    let list: Boisson[] = [];
    if (slug === 'boissons-artisanales') {
      list = this.boissons().filter(b => b.type_boisson === 'Jus' || !b.type_boisson);
    } else if (slug === 'desserts-cremes-glacees') {
      list = this.boissons().filter(b => b.type_boisson === 'Dessert');
    } else if (slug === 'tous') {
      list = this.boissons();
    }
    if (!term) return list;
    return list.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(term));
  }

  get showBoissonsOnly(): boolean {
    const slug = this.activeCategorie();
    return slug === 'boissons-artisanales' || slug === 'desserts-cremes-glacees';
  }

  setCategorie(slug: string): void {
    this.activeCategorie.set(slug);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  selectOption(platId: number, optionLabel: string, value: string): void {
    if (!this.optionsSelectionnees[platId]) {
      this.optionsSelectionnees[platId] = {};
    }
    this.optionsSelectionnees[platId][optionLabel] = value;
  }

  onOptionChange(platId: number, optionLabel: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectOption(platId, optionLabel, target.value);
  }

  addToCart(plat: Plat): void {
    const options = this.optionsSelectionnees[plat.id] || {};
    const normalizedPlat: Plat = {
      ...plat,
      name: plat.name || (plat as any).nom || 'Plat',
      price: plat.price !== undefined ? plat.price : (plat as any).prix || 0
    };
    this.panierService.addItem(normalizedPlat, options);
  }

  addBoissonToCart(boisson: Boisson): void {
    const boissonPlat: Plat = {
      id: boisson.id,
      name: boisson.name || (boisson as any).nom || 'Boisson',
      description: `${boisson.description} ${boisson.volume ? ' · ' + boisson.volume : ''}`,
      price: boisson.price !== undefined ? boisson.price : (boisson as any).prix || 0,
      image: boisson.image || '',
      options_disponibles: {},
      is_active: true,
    };
    this.panierService.addItem(boissonPlat);
  }

  togglePanier(): void {
    this.panierOuvert.update((v) => !v);
  }

  validerWhatsApp(): void {
    const message = this.panierService.genererMessageWhatsApp();
    // Numéro officiel WhatsApp Saveurs d'Agojiés (+229 01 97 00 00 00 / WhatsApp Bénin)
    const url = `https://wa.me/2290197000000?text=${message}`;
    window.open(url, '_blank');
  }

  getOptionsKeys(options?: Record<string, string[]> | Record<string, string>): string[] {
    return options ? Object.keys(options) : [];
  }

  getOptionsEntries(options?: Record<string, string[]>): [string, string[]][] {
    return options ? (Object.entries(options) as [string, string[]][]) : [];
  }

  getCartOptionsEntries(options: Record<string, string>): [string, string][] {
    return Object.entries(options);
  }

  private getFallbackPlats(): Plat[] {
    return [
      { id: 1, name: 'Brochettes spéciales (Gambas, Poulet, Poisson, Viande)', description: 'Brochettes tendres mariné aux épices du jardin et grillées au feu de bois', price: 2500, options_disponibles: { 'Viande': ['Gambas', 'Poulet fermier', 'Poisson', 'Viande de mouton'] }, image: 'assets/images/plat-poulet.jpg' },
      { id: 2, name: 'Fataya croustillant (Viande ou Poulet)', description: 'Chaussons dorés et croustillants garnis à la viande hachée ou au poulet', price: 1500, options_disponibles: { 'Garniture': ['Viande hachée', 'Poulet haché'] }, image: 'assets/images/plat-default.jpg' },
      { id: 3, name: 'Sauté de crabe rouge + Accompagnement', description: 'Crabes rouges sautés à la sauce tomate épicée, accompagnés de Piron ou Akassa', price: 4500, options_disponibles: { 'Accompagnement': ['Piron rouge', 'Piron blanc', 'Akassa (Maïs)'] }, image: 'assets/images/plat-poisson.jpg' },
      { id: 4, name: 'Souris d\'agneau braisée + Purée', description: 'Souris d\'agneau confite aux herbes aromatiques, servie avec purée maison', price: 7000, options_disponibles: { 'Purée': ['Purée de pommes de terre', 'Purée de patates douces'] }, image: 'assets/images/plat-chef.jpg' },
      { id: 5, name: 'Méchoui d\'exception (Dinde ou Mouton)', description: 'Méchoui traditionnel rôti à la broche au feu de bois pendant plusieurs heures', price: 12000, options_disponibles: { 'Viande': ['Méchoui de Dinde entière', 'Méchoui de Mouton (Quartier)'] }, image: 'assets/images/plat-mechoui.jpg' },
      { id: 6, name: 'Braisés gourmands (Tilapia, Poulet, Caille, Lapin, Pintade)', description: 'Grillades braisées servies avec marinade pimentée maison et oignons caramélisés', price: 5500, options_disponibles: { 'Viande/Poisson': ['Tilapia braisé', 'Poulet braisé', 'Caille braisée', 'Lapin braisé', 'Pintade braisée'] }, image: 'assets/images/plat-gourmet.jpg' },
      { id: 7, name: 'Couscous Wassa Wassa (Igname séché)', description: 'Couscous traditionnel d\'igname séché servi avec friture pimentée et viande au choix', price: 4000, options_disponibles: { 'Viande': ['Poisson braisé', 'Lapin de ferme', 'Caille grillée'] }, image: 'assets/images/plat-couscous.jpg' },
      { id: 8, name: 'Thièpe Djène sénégalais (Rouge ou Blanc)', description: 'Riz sénégalais mijoté aux légumes frais et mérou/capitaine', price: 3500, options_disponibles: { 'Variante': ['Thièpe Djène Rouge', 'Thièpe Djène Blanc'] }, image: 'assets/images/plat-riz.jpg' },
      { id: 9, name: 'Pâte rouge (Amiwo) spéciale', description: 'Amiwo de maïs préparé au bouillon aromatisé avec piment et viande grillée', price: 3500, options_disponibles: { 'Viande': ['Poulet fermier', 'Lapin sauté', 'Caille braisée'] }, image: 'assets/images/plat-amiwo.jpg' },
      { id: 10, name: 'Piron (Rouge ou Blanc) gourmand', description: 'Piron de gari de manioc préparé au jus de poisson ou de viande épicé', price: 3500, options_disponibles: { 'Viande/Poisson': ['Poulet braisé', 'Lapin sauté', 'Caille grillée', 'Poisson braisé'] }, image: 'assets/images/plat-bol.jpg' },
      { id: 11, name: 'Sauce Kpêtê (Mouton ou Lapin braisé)', description: 'Sauce Kpêtê traditionnelle onctueuse avec viande braisée', price: 3000, options_disponibles: { 'Viande': ['Mouton braisé', 'Lapin braisé'] }, image: 'assets/images/plat-soupe.jpg' },
      { id: 12, name: 'Sauce feuilles maison (Moringa, Noni, Baobab...)', description: 'Sauces préparées à partir de légumes bio fraîchement cueillis à la ferme', price: 2000, options_disponibles: { 'Feuille au choix': ['Moringa', 'Noni', 'Baobab', 'Basilic légume', 'Vernonia (Fanti)', 'Amarante (Gboma)'] }, image: 'assets/images/plat-verte.jpg' }
    ];
  }

  private getFallbackBoissons(): Boisson[] {
    return [
      { id: 101, name: 'Jus de fruits pressés à froid (Agrumes / Mandarine)', description: 'Agrumes et mandarines de notre pépinière pressés sans eau ni sucre ajouté', price: 1500, type_boisson: 'Jus', image: 'assets/images/jus-agrumes.jpg' },
      { id: 102, name: 'Jus de Baobab naturel', description: 'Jus onctueux de pulpe de baobab riche en vitamine C', price: 1500, type_boisson: 'Jus', image: 'assets/images/dessert.jpg' },
      { id: 103, name: 'Jus d\'Ananas frais', description: 'Jus d\'ananas pain de sucre de Allada pressé', price: 1500, type_boisson: 'Jus', image: 'assets/images/jus-orange.jpg' },
      { id: 104, name: 'Jus de Bissap (Fleur d\'Hibiscus)', description: 'Infusion rafraîchissante de fleurs de bissap à la menthe', price: 1500, type_boisson: 'Jus', image: 'assets/images/plat-default.jpg' },
      { id: 105, name: 'Jus de Corossol bio', description: 'Nectar délicat et velouté de corossol frais', price: 2000, type_boisson: 'Jus', image: 'assets/images/plat-bol.jpg' },
      { id: 106, name: 'Salade de fruits frais maison', description: 'Cocktail de fruits de saison (Mangue, Papaye, Ananas, Passiflore, Noni)', price: 2000, type_boisson: 'Dessert', image: 'assets/images/fruits.jpg' },
      { id: 107, name: 'Dêguê traditionnel (Mil ou Blé)', description: 'Dessert onctueux au grumeaux de mil ou blé et yaourt frais', price: 1500, type_boisson: 'Dessert', image: 'assets/images/plat-verte.jpg' },
      { id: 108, name: 'Crème glacée maison (Baobab, Basilic, Fleur d\'oranger)', description: 'Crème glacée artisanale réalisée avec nos arômes naturels', price: 2000, type_boisson: 'Dessert', image: 'assets/images/glace.jpg' }
    ];
  }
}
