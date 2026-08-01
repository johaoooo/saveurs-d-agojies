import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProgramDetail {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  description: string;
  highlights: string[];
  imagePrimary: string;
  imageSecondary?: string;
  imageRatioPrimary: string;
}

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css',
})
export class FormationsComponent {
  programs: ProgramDetail[] = [
    {
      id: 'cuisine-traiteur',
      title: 'Art Culinaire, Gastronomie & Traiteur Événementiel',
      subtitle: 'De la cuisine au feu de bois à la gestion des grandes réceptions',
      category: 'Restauration & Gastronomie',
      duration: '2 à 3 semaines de formation pratique',
      description: 'Découvrez les secrets de la gastronomie béninoise et africaine. Apprenez à élaborer des sauces bio traditionnelles, maîtriser les cuissons au feu de bois pour méchouis et braisés d\'exception, et orchestrer des services traiteur clés en main.',
      highlights: [
        'Méchouis sur broche (Dinde entière & Mouton) et braisés (Poulet Goliath, Pintade, Lapin, Caille)',
        'Sauces maison bio & jus artisanaux (Kpêtê, Djan, Moringa, Noni, Bissap, Corossol)',
        'Pâtes traditionnelles & spécialités (Amiwo, Piron rouge/blanc, Wassa Wassa, Thièpe)',
        'Dressage de buffets, logistique événementielle et cocktails pour mariages & séminaires'
      ],
      imagePrimary: 'assets/images/cuisine-chef.jpg',
      imageSecondary: 'assets/images/plat-mechoui.jpg',
      imageRatioPrimary: 'ratio-tall'
    },
    {
      id: 'elevage-pisciculture',
      title: 'Élevage Éco-responsable & Pisciculture',
      subtitle: 'Conduite d\'élevages de volailles rares, petits animaux et bassins aquacoles',
      category: 'Élevage & Aquaculture',
      duration: '2 semaines d\'immersion terrain',
      description: 'Une formation complète sur le terrain au cœur de notre ferme. Apprenez les méthodes d\'élevage bio pour les volailles d\'exception, le petit bétail et la conduite des bassins piscicoles de la reproduction au poisson marchand.',
      highlights: [
        'Élevage d\'Oies de Chine (souche pure), Dindes Bronzé d\'Amérique & Poulets Goliath',
        'Petits herbivores (Cobayes, Lapins, Moutons Bali Bali/Oudah, Chèvres rousses de Maradi)',
        'Reproduction, triage d\'alevins et nutrition bio des poissons Clarias, Tilapia & Pangasius',
        'Prévention sanitaire naturelle, suivi des cycles et commercialisation'
      ],
      imagePrimary: 'assets/images/volaille.jpg',
      imageSecondary: 'assets/images/poisson.jpg',
      imageRatioPrimary: 'ratio-wide'
    },
    {
      id: 'pepiniere-apiculture',
      title: 'Pépinière Fruitière, Herbes Bio & Apiculture',
      subtitle: 'Multiplication végétale, cultures aromatiques et récolte de miels rares',
      category: 'Arboriculture & Apiculture',
      duration: '1 à 2 semaines de pratique',
      description: 'Apprenez à multiplier des végétaux d\'avenir et à produire du miel d\'exception. Cette formation aborde le greffage d\'arbres fruitiers bio, la culture maraîchère sans pesticides et la gestion éco-responsable des ruches.',
      highlights: [
        'Greffage & bouturage d\'arbres fruitiers (Noni, Passiflore, Tangelo, Avocatier, Manguier)',
        'Culture de rejets sélectionnés (Bananier, Cocotier nain, Palmier)',
        'Culture bio d\'herbes aromatiques (Moringa, Citronnelle, Menthe, Basilic, Romarin, Thym)',
        'Conduite de ruches d\'abeilles en bambouseraie et extraction du miel pur'
      ],
      imagePrimary: 'assets/images/plants.jpg',
      imageSecondary: 'assets/images/miel.jpg',
      imageRatioPrimary: 'ratio-square'
    }
  ];

  demanderInfoWhatsApp(titreProgramme: string): void {
    const text = `Bonjour Saveurs d'Agojiés, je souhaite obtenir des informations sur la formation : ${titreProgramme}`;
    window.open(`https://wa.me/2290197000000?text=${encodeURIComponent(text)}`, '_blank');
  }
}
