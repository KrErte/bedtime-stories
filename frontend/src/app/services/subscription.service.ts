import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private api: ApiService) {}

  checkout(currency?: string) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const cur = currency ?? (tz.startsWith('Europe') ? 'eur' : 'usd');
    return this.api.post<{ url: string }>(`/subscription/checkout?currency=${cur}`);
  }

  getStatus() {
    return this.api.get<{ status: string }>('/subscription/status');
  }

  cancel() {
    return this.api.post<{ message: string }>('/subscription/cancel');
  }
}
