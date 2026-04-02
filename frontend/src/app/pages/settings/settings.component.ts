import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { NativeService } from '../../services/native.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

      @if (native.isNative) {
        <div class="card mb-6">
          <h2 class="font-semibold text-lg mb-4">Bedtime Reminder</h2>
          <div class="flex items-center justify-between">
            <p class="text-navy-300 text-sm">Get a daily notification at bedtime</p>
            <div class="flex items-center gap-3">
              <select [(ngModel)]="reminderHour" class="input-field !w-auto !py-2 text-sm">
                @for (h of hours; track h) {
                  <option [value]="h">{{ h > 12 ? h - 12 : h }}:00 {{ h >= 12 ? 'PM' : 'AM' }}</option>
                }
              </select>
              <button (click)="toggleReminder()" [class]="reminderOn ? 'btn-primary text-sm' : 'btn-secondary text-sm'">
                {{ reminderOn ? 'On' : 'Off' }}
              </button>
            </div>
          </div>
        </div>
      }

      <div class="card">
        <button (click)="auth.logout()" class="text-red-400 hover:text-red-300 text-sm">Sign out</button>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  reminderHour = 20;
  reminderOn = false;
  hours = [18, 19, 20, 21, 22];

  constructor(public auth: AuthService, private subscription: SubscriptionService, public native: NativeService) {
    const saved = localStorage.getItem('bedtimeReminder');
    if (saved) {
      const data = JSON.parse(saved);
      this.reminderHour = data.hour;
      this.reminderOn = data.on;
    }
  }

  toggleReminder() {
    this.reminderOn = !this.reminderOn;
    if (this.reminderOn) {
      this.native.scheduleBedtimeReminder(this.reminderHour, 0);
    } else {
      this.native.cancelBedtimeReminder();
    }
    localStorage.setItem('bedtimeReminder', JSON.stringify({ hour: this.reminderHour, on: this.reminderOn }));
  }

  cancelSubscription() {
    if (confirm('Are you sure? You will lose Pro features at the end of your billing period.')) {
      this.subscription.cancel().subscribe();
    }
  }
}
