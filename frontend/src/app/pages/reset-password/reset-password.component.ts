import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="card w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Set New Password</h1>
        @if (success()) {
          <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-300 text-center">
            Password reset! <a routerLink="/login" class="underline">Sign in</a>
          </div>
        } @else {
          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm">{{ error() }}</div>
          }
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <input type="password" [(ngModel)]="password" name="password" placeholder="New password (min 6 chars)" class="input-field" required minlength="6">
            <button type="submit" class="btn-primary w-full" [disabled]="loading()">
              {{ loading() ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  token = '';
  loading = signal(false);
  error = signal('');
  success = signal(false);

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => this.success.set(true),
      error: (err) => {
        this.error.set(err.error?.message || 'Reset failed');
        this.loading.set(false);
      }
    });
  }
}
