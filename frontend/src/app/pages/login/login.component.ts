import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit.ee</h1>
          <p class="text-navy-300 mt-2">Welcome back</p>
        </div>
        @if (error()) {
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">{{ error() }}</div>
        }
        <form (ngSubmit)="onLogin()" class="space-y-4">
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" class="input-field" required>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Password" class="input-field" required>
          <button type="submit" class="btn-primary w-full" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="mt-4 text-center text-sm text-navy-400">
          <a routerLink="/forgot-password" class="text-story-purple hover:underline">Forgot password?</a>
        </div>
        <div class="mt-6 text-center text-sm text-navy-400">
          Don't have an account? <a routerLink="/register" class="text-story-purple hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/app']),
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed');
        this.loading.set(false);
      }
    });
  }
}
