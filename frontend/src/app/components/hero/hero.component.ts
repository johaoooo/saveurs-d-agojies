import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  slides = [
    'https://res.cloudinary.com/dzxesa3wi/image/upload/v1785612103/WhatsApp_Image_2026-08-01_at_20.13.49-removebg-preview_1_af8p7b.png',
    'https://res.cloudinary.com/dzxesa3wi/image/upload/v1785622679/WhatsApp_Image_2026-08-01_at_23.13.40-removebg-preview_qyfecu.png',
    'assets/images/plat-gourmet.jpg',
    'assets/images/champ.jpg',
  ];
  private timer: any;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentSlide.update((idx) => (idx + 1) % this.slides.length);
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
