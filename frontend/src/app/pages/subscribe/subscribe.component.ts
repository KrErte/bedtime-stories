import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-3xl font-bold mb-4">Upgrade to Pro</h1>
      <p class="text-navy-300 mb-8">Unlock the full bedtime story experience</p>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Free -->
        <div class="card">
          <h3 class="font-semibold text-lg mb-2">Free</h3>
          <p class="text-3xl font-bold mb-4">$0<span class="text-sm text-navy-400">/month</span></p>
          <ul class="text-sm text-navy-300 space-y-2 text-left mb-6">
            <li>&#10003; 1 story per day</li>
            <li>&#10003; 200 words max</li>
            <li>&#10003; 1 illustration</li>
            <li class="text-navy-500">&#10007; No audio narration</li>
            <li class="text-navy-500">&#10007; No PDF export</li>
          </ul>
          <span class="text-navy-400 text-sm">Current plan</span>
        </div>

        <!-- Pro -->
        <div class="card border-story-purple/50 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-story-purple text-white text-xs px-3 py-1 rounded-full font-semibold">Most Popular</div>
          <h3 class="font-semibold text-lg mb-2">Pro</h3>
          <p class="text-3xl font-bold mb-4">$7.99<span class="text-sm text-navy-400">/month</span></p>
          <ul class="text-sm text-navy-200 space-y-2 text-left mb-6">
            <li>&#10003; Unlimited stories (20/day)</li>
            <li>&#10003; 500-600 words per story</li>
            <li>&#10003; 3-4 illustrations</li>
            <li>&#10003; Audio narration (4 voices)</li>
            <li>&#10003; PDF export</li>
            <li>&#10003; 7-day free trial</li>
          </ul>
          <button (click)="checkout()" class="btn-primary w-full" [disabled]="loading()">
            {{ loading() ? 'Redirecting...' : 'Start Free Trial' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SubscribeComponent {
  loading = signal(false);

  constructor(private subscription: SubscriptionService, public auth: AuthService) {}

  checkout() {
    this.loading.set(true);
    this.subscription.checkout().subscribe({
      next: (res) => window.location.href = res.url,
      error: () => this.loading.set(false),
    });
  }
}
