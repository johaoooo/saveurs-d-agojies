import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      sujet: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contactForm.valid) {
      const whatsappMessage = `*Nouveau message - Saveurs d'Agojie*%0A%0A` +
        `*Sujet:* ${this.contactForm.value.sujet}%0A` +
        `*Nom:* ${this.contactForm.value.nom}%0A` +
        `*Email:* ${this.contactForm.value.email}%0A` +
        `*Téléphone:* ${this.contactForm.value.telephone}%0A` +
        `*Message:* ${this.contactForm.value.message}`;
      window.open(`https://wa.me/2290197000000?text=${whatsappMessage}`, '_blank');
      this.contactForm.reset();
      this.submitted = false;
    }
  }
}
