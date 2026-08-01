const IMG = {
  volaille: 'assets/images/volaille.jpg',
  betail: 'assets/images/betail.jpg',
  poisson: 'assets/images/poisson.jpg',
  plants: 'assets/images/plants.jpg',
  miel: 'assets/images/miel.jpg',
  fruits: 'assets/images/fruits.jpg',
  champ: 'assets/images/champ.jpg',
  ferme: 'assets/images/ferme-animaux.jpg',
  platGourmet: 'assets/images/plat-gourmet.jpg',
  platMechoui: 'assets/images/plat-mechoui.jpg',
  platChef: 'assets/images/plat-chef.jpg',
  platPoulet: 'assets/images/plat-poulet.jpg',
  platPoisson: 'assets/images/plat-poisson.jpg',
  platCouscous: 'assets/images/plat-couscous.jpg',
  platRiz: 'assets/images/plat-riz.jpg',
  platAmiwo: 'assets/images/plat-amiwo.jpg',
  platBol: 'assets/images/plat-bol.jpg',
  platSoupe: 'assets/images/plat-soupe.jpg',
  platVerte: 'assets/images/plat-verte.jpg',
  platPizza: 'assets/images/plat-pizza.jpg',
  platSalade: 'assets/images/plat-salade.jpg',
  platDefault: 'assets/images/plat-default.jpg',
  jusAgrumes: 'assets/images/jus-agrumes.jpg',
  jusOrange: 'assets/images/jus-orange.jpg',
  dessert: 'assets/images/dessert.jpg',
  glace: 'assets/images/glace.jpg',
};

const has = (text: string, words: string[]): boolean => {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
};

export function resolveFermeImage(name: string): string {
  const t = name.toLowerCase();
  if (has(t, ['mouton', 'chèvre', 'chevre', 'bœuf', 'boeuf', 'veau', 'bétail', 'betail', 'agneau'])) return IMG.betail;
  if (has(t, ['volaille', 'poulet', 'pintade', 'dinde', 'oie', 'poussin', 'canard', 'caille', 'œuf', 'oeuf'])) return IMG.volaille;
  if (has(t, ['poisson', 'tilapia', 'clarias', 'alevin', 'pisciculture', 'poisson-chat', 'bramar', 'pengasius'])) return IMG.poisson;
  if (has(t, ['miel', 'ruche', 'abeille'])) return IMG.miel;
  if (has(t, ['plant', 'pépinière', 'pepiniere', 'pépiniere', 'semis', 'arbuste', 'arbre', 'pommier', 'avocatier', 'citronnier', 'manguier', 'papayer', 'mandarinier', 'tangelo', 'tangor', 'baobab', 'irvingia', 'greffé', 'greffe', 'bananier', 'cocotier'])) return IMG.plants;
  if (has(t, ['fruit', 'noni', 'banane', 'palmier', 'agrume', 'mangue', 'ananas', 'cannelle'])) return IMG.fruits;
  if (has(t, ['herbe', 'aromatique', 'moringa', 'basilic', 'légume', 'legume'])) return IMG.champ;
  return IMG.ferme;
}

export function resolveFermeCategoryImage(slug: string): string {
  const s = slug.toLowerCase();
  if (has(s, ['elevage', 'oiseau', 'volaille'])) return IMG.volaille;
  if (has(s, ['pisciculture', 'poisson'])) return IMG.poisson;
  if (has(s, ['pepiniere', 'fruitier', 'plant'])) return IMG.plants;
  if (has(s, ['aromatique', 'miel'])) return IMG.miel;
  return IMG.ferme;
}

export function resolveMenuImage(name: string): string {
  const t = name.toLowerCase();
  if (has(t, ['méchoui', 'mechoui'])) return IMG.platMechoui;
  if (has(t, ['agneau', 'souris'])) return IMG.platChef;
  if (has(t, ['couscous', 'attiéké', 'attieke', 'manioc', 'millet', 'igname', 'wassa'])) return IMG.platCouscous;
  if (has(t, ['riz', 'atassi', 'thièpe', 'thiepe', 'mafé', 'mafe', 'cantonnais', 'vermicelle', 'yassa'])) return IMG.platRiz;
  if (has(t, ['fataya', 'beignet', 'chausson'])) return IMG.platDefault;
  if (has(t, ['feuille', 'moringa', 'basilic', 'épinard', 'epinard', 'gboma'])) return IMG.platVerte;
  if (has(t, ['kpêtê', 'kpetê', 'kpeté', 'soupe', 'bouillon', 'sauce', 'pepper'])) return IMG.platSoupe;
  if (has(t, ['broche', 'grillade', 'braisé', 'braise', 'grillé', 'grille', 'steak', 'côtelette', 'cotelette'])) return IMG.platGourmet;
  if (has(t, ['farcie', 'volaille', 'poulet'])) return IMG.platPoulet;
  if (has(t, ['poisson', 'crabe', 'crevette', 'gambas', 'fruit de mer'])) return IMG.platPoisson;
  if (has(t, ['amiwo', 'bomiwo', 'pâte', 'pate', 'gboassa', 'abodé', 'abode'])) return IMG.platAmiwo;
  if (has(t, ['piron', 'akassa', 'tubercule'])) return IMG.platBol;
  if (has(t, ['lasagne', 'pizza'])) return IMG.platPizza;
  if (has(t, ['salade', 'nêm', 'nem'])) return IMG.platSalade;
  return IMG.platDefault;
}

export function resolveBoissonImage(name: string, type = ''): string {
  const t = `${name} ${type}`.toLowerCase();
  if (has(t, ['glace', 'crème glacée', 'creme glacee'])) return IMG.glace;
  if (has(t, ['salade de fruit', 'fruits frais'])) return IMG.fruits;
  if (has(t, ['agrume', 'mandarine', 'citron', 'citronnade', 'orange', 'pamplemousse'])) return IMG.jusAgrumes;
  if (has(t, ['ananas', 'mangue', 'passiflore', 'papaye'])) return IMG.jusOrange;
  if (has(t, ['corossol', 'pomme cannelle', 'baobab', 'noni'])) return IMG.fruits;
  if (has(t, ['dêguê', 'deguê', 'degué'])) return IMG.platBol;
  if (has(t, ['bissap', 'mil', 'ngbô', 'gingembre'])) return IMG.dessert;
  return IMG.jusAgrumes;
}
