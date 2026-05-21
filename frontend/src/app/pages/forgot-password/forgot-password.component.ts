import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Reset Password</h1>
        @if (sent()) {
          <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-300 text-center">
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <input type="email" [(ngModel)]="email" name="email" placeholder="Your email" class="input-field" required>
            <button type="submit" class="btn-primary w-full" [disabled]="loading()">
              {{ loading() ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        }
        <div class="mt-6 text-center">
          <a routerLink="/login" class="text-story-purple text-sm hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  sent = signal(false);

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.loading.set(true);
    this.auth.forgotPassword(this.email).subscribe({
      next: () => this.sent.set(true),
      error: () => this.sent.set(true),
    });
  }
}
