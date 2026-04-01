import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private api: ApiService) {}

  checkout() {
    return this.api.post<{ url: string }>('/subscription/checkout');
  }

  getStatus() {
    return this.api.get<{ status: string }>('/subscription/status');
  }

  cancel() {
    return this.api.post<{ message: string }>('/subscription/cancel');
  }
}
