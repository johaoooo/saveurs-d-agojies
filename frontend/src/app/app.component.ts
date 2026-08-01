import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  loading = signal(true);
  fadeOut = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoader();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.hideLoader();
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.hideLoader();
    }, 850);
  }

  showLoader(): void {
    this.fadeOut.set(false);
    this.loading.set(true);
  }

  hideLoader(): void {
    this.fadeOut.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 400);
  }
}
