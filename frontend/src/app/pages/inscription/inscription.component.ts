import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css',
})
export class InscriptionComponent {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) return;
    const { password, password_confirm, ...rest } = this.registerForm.value;
    if (password !== password_confirm) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.auth.register({ ...rest, password, password_confirm }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        const errors = err.error || {};
        this.errorMessage =
          errors.username?.[0] ||
          errors.email?.[0] ||
          errors.password?.[0] ||
          errors.password_confirm?.[0] ||
          'Une erreur est survenue, réessayez.';
      },
    });
  }
}
