import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  servicesDropdownOpen = signal(false);
  scrolled = signal(false);

  constructor(
    protected panierService: PanierService,
    protected authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  toggleServicesDropdown(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.servicesDropdownOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
    this.servicesDropdownOpen.set(false);
  }
}
