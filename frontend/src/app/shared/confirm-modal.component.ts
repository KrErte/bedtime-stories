import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="cancel()"></div>
        <div class="relative bg-navy-800 border border-navy-600/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          @if (icon) {
            <div class="text-3xl text-center mb-4">{{ icon }}</div>
          }
          <h3 class="text-lg font-semibold text-white mb-2 text-center">{{ title }}</h3>
          @if (message) {
            <p class="text-navy-300 text-sm text-center mb-6">{{ message }}</p>
          }
          <div class="flex gap-3">
            <button (click)="cancel()"
              class="flex-1 px-4 py-2.5 rounded-xl border border-navy-600 text-navy-300 hover:text-white hover:border-navy-400 transition-all text-sm font-medium">
              {{ cancelLabel }}
            </button>
            <button (click)="confirm()"
              [class]="confirmDanger
                ? 'flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all text-sm font-medium'
                : 'flex-1 px-4 py-2.5 rounded-xl bg-story-purple text-white hover:opacity-90 transition-all text-sm font-medium'">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = '';
  @Input() icon = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmDanger = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() { this.confirmed.emit(); }
  cancel() { this.cancelled.emit(); }
}
