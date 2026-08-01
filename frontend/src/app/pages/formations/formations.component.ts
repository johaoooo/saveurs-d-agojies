import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface ModuleFormation {
  id: string;
  title: string;
  category: string;
  icon: string;
  duration: string;
  level: string;
  description: string;
  topics: string[];
}

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css',
})
export class FormationsComponent {
  selectedCategory = signal<string>('tous');
  inscriptionForm: FormGroup;
  submitted = false;

  modules: ModuleFormation[] = [
    {
      id: 'cuis-1',
      title: 'Art Culinaire & Gastronomie Béninoise',
      category: 'cuisine',
      icon: '🍳',
      duration: '2 semaines (Intensif)',
      level: 'Tous niveaux',
      description: 'Maîtrisez la préparation des plats traditionnels, sauces maison bio et cuissons ancestrales au feu de bois.',
      topics: [
        'Préparation des Sauces Bio (Kpêtê, Djan, Adidon, Sauces feuilles Moringa/Noni)',
        'Techniques de Braisés & Grillades au feu de bois (Poulet, Lapin, Pintade, Caille)',
        'Pâtes & Spécialités traditionnelles (Amiwo, Piron rouge/blanc, Wassa Wassa, Thièpe)',
        'Jus naturels pressés à froid & Desserts artisanaux (Dêguê, Crèmes glacées)'
      ]
    },
    {
      id: 'trait-2',
      title: 'Traiteur & Événementiel Clé en Main',
      category: 'cuisine',
      icon: '🍷',
      duration: '3 semaines',
      level: 'Professionnel',
      description: 'Apprenez à gérer les réceptions d\'envergure : mariages, baptêmes, méchouis et séminaires d\'entreprise.',
      topics: [
        'Organisation & Préparation de Méchouis sur broche (Mouton & Dinde entière)',
        'Dressage esthétique de buffets froids et chauds',
        'Gestion de brigade en salle & service haut de gamme',
        'Chiffrage, devis traiteur & logistique événementielle'
      ]
    },
    {
      id: 'elev-3',
      title: 'Aviculture & Volailles Rares',
      category: 'elevage',
      icon: '🐓',
      duration: '1 à 2 semaines',
      level: 'Pratique terrain',
      description: 'Conduite d\'élevage professionnel de volailles de souche pure et races performantes.',
      topics: [
        'Élevage d\'Oies de Chine (souche pure) et Dindes Bronzé d\'Amérique',
        'Poulets Goliath & Poulets améliorés cou nu',
        'Alimentation bio, prophylaxie sanitaire & soins vétérinaires',
        'Conduite d\'écloserie & gestion des couvoirs'
      ]
    },
    {
      id: 'pisc-4',
      title: 'Pisciculture & Gestion des Bassins',
      category: 'elevage',
      icon: '🐟',
      duration: '2 semaines',
      level: 'Pratique terrain',
      description: 'Maîtrisez le cycle complet d\'élevage aquacole éco-responsable.',
      topics: [
        'Reproduction et élevage de Clarias (Poisson-chat), Tilapia et Pangasius',
        'Triage, calibrage et suivi de croissance des alevins',
        'Qualité de l\'eau, filtration et nutrition aquacole bio',
        'Commercialisation du poisson frais marchand'
      ]
    },
    {
      id: 'pep-5',
      title: 'Pépinière Fruitière & Greffage',
      category: 'pepiniere',
      icon: '🌱',
      duration: '1 semaine',
      level: 'Pratique terrain',
      description: 'Techniques modernes de multiplication végétale et culture d\'arbres fruitiers sélectionnés.',
      topics: [
        'Greffage & bouturage d\'arbres fruitiers (Noni, Passiflore, Tangelo, Avocatier)',
        'Culture de rejets sélectionnés (Bananier, Cocotier nain, Palmier)',
        'Création de substrats fertiles bio sans pesticides',
        'Gestion des serres et suivi phytosanitaire naturel'
      ]
    },
    {
      id: 'apic-6',
      title: 'Apiculture & Plantes Aromatiques Bio',
      category: 'pepiniere',
      icon: '🍯',
      duration: '1 semaine',
      level: 'Pratique terrain',
      description: 'Installation de ruches et culture d\'herbes aromatiques médicinales.',
      topics: [
        'Conduite des ruches d\'abeilles en bambouseraie et palmeraie',
        'Récolte et extraction du miel pur d\'abeilles',
        'Culture d\'herbes aromatiques (Moringa, Citronnelle, Menthe, Basilic, Thym)',
        'Séchage et conservation des feuilles bio'
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.inscriptionForm = this.fb.group({
      formation: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      niveau: ['Débutant'],
      message: ['']
    });
  }

  get filteredModules(): ModuleFormation[] {
    const cat = this.selectedCategory();
    if (cat === 'tous') return this.modules;
    return this.modules.filter(m => m.category === cat);
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.inscriptionForm.valid) {
      const val = this.inscriptionForm.value;
      const whatsappMessage = `*Demande d'Inscription Formation - Saveurs d'Agojiés*%0A%0A` +
        `*Formation:* ${val.formation}%0A` +
        `*Nom complet:* ${val.nom}%0A` +
        `*Email:* ${val.email}%0A` +
        `*Téléphone:* ${val.telephone}%0A` +
        `*Niveau:* ${val.niveau}%0A` +
        `*Message/Attentes:* ${val.message || 'Aucun'}`;
      window.open(`https://wa.me/2290197000000?text=${whatsappMessage}`, '_blank');
      this.inscriptionForm.reset({ niveau: 'Débutant' });
      this.submitted = false;
    }
  }
}
