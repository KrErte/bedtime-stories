import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit.ee</h1>
          <p class="text-navy-300 mt-2">Create your account</p>
        </div>
        @if (error()) {
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">{{ error() }}</div>
        }
        <form (ngSubmit)="onRegister()" class="space-y-4">
          <input type="text" [(ngModel)]="name" name="name" placeholder="Your name" class="input-field" required>
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" class="input-field" required>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Password (min 6 chars)" class="input-field" required minlength="6">
          <button type="submit" class="btn-primary w-full" [disabled]="loading()">
            {{ loading() ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-navy-400">
          Already have an account? <a routerLink="/login" class="text-story-purple hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.email, this.password, this.name).subscribe({
      next: () => this.router.navigate(['/app/children']),
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
