import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FermeComponent } from './pages/ferme/ferme.component';
import { MenuComponent } from './pages/menu/menu.component';
import { FormationsComponent } from './pages/formations/formations.component';
import { AProposComponent } from './pages/a-propos/a-propos.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ferme', component: FermeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'formations', component: FormationsComponent },
  { path: 'a-propos', component: AProposComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: '**', redirectTo: '' },
];
