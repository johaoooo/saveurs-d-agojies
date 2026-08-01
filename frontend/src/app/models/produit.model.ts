export interface CategorieFerme {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  order?: number;
}

export interface ProduitFerme {
  id: number;
  categorie?: number;
  categorieId?: number;
  categorie_name?: string;
  name: string;
  nom?: string;
  slug?: string;
  description: string;
  price: number;
  prix?: number;
  unit: string;
  unite?: string;
  image?: string;
  stock?: number;
  is_active?: boolean;
  is_featured?: boolean;
  bio?: boolean;
}

export interface CategorieMenu {
  id: number;
  name: string;
  slug: string;
  order?: number;
  description?: string;
  icon?: string;
}

export interface Plat {
  id: number;
  categorie?: number;
  categorieId?: number;
  categorie_name?: string;
  name: string;
  nom?: string;
  slug?: string;
  description: string;
  price: number;
  prix?: number;
  image?: string;
  options_disponibles?: Record<string, string[]>;
  options?: string[];
  is_active?: boolean;
  is_featured?: boolean;
}

export interface Boisson {
  id: number;
  name: string;
  nom?: string;
  slug?: string;
  description: string;
  price: number;
  prix?: number;
  volume?: string;
  type_boisson?: string;
  image?: string;
  is_active?: boolean;
}

export interface PanierItem {
  plat: Plat;
  quantite: number;
  options: Record<string, string>;
}

export interface Commande {
  nom: string;
  email?: string;
  telephone: string;
  adresse_livraison?: string;
  notes?: string;
  items: any[];
  total: number;
}

export interface ContactMessage {
  sujet: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
}
