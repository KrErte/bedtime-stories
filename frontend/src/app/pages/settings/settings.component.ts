import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-8">Settings</h1>

      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Account</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-navy-400">Email</span>
            <span>{{ auth.currentUser()?.email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-navy-400">Name</span>
            <span>{{ auth.currentUser()?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-navy-400">Stories created</span>
            <span>{{ auth.currentUser()?.storiesGeneratedTotal }}</span>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <h2 class="font-semibold text-lg mb-4">Subscription</h2>
        <div class="flex items-center justify-between">
          <div>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
              [class]="auth.isPro() ? 'bg-story-purple/20 text-story-purple' : 'bg-navy-700 text-navy-300'">
              {{ auth.isPro() ? 'Pro' : 'Free' }}
            </span>
          </div>
          @if (auth.isPro()) {
            <button (click)="cancelSubscription()" class="text-sm text-red-400 hover:text-red-300">Cancel subscription</button>
          } @else {
            <a routerLink="/app/subscribe" class="btn-primary text-sm">Upgrade to Pro</a>
          }
        </div>
      </div>

      <div class="card">
        <button (click)="auth.logout()" class="text-red-400 hover:text-red-300 text-sm">Sign out</button>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  constructor(public auth: AuthService, private subscription: SubscriptionService) {}

  cancelSubscription() {
    if (confirm('Are you sure? You will lose Pro features at the end of your billing period.')) {
      this.subscription.cancel().subscribe();
    }
  }
}
