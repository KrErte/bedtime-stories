import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: string;
  storiesGeneratedToday: number;
  storiesGeneratedTotal: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  isPro = computed(() => this.currentUser()?.subscriptionStatus === 'pro');

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  register(email: string, password: string, name: string) {
    return this.http.post<AuthResponse>(`${this.api}/auth/register`, { email, password, name })
      .pipe(tap(res => this.handleAuth(res)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(tap(res => this.handleAuth(res)));
  }

  googleAuth(idToken: string) {
    return this.http.post<AuthResponse>(`${this.api}/auth/google`, { idToken })
      .pipe(tap(res => this.handleAuth(res)));
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    return this.http.post<AuthResponse>(`${this.api}/auth/refresh`, { refreshToken })
      .pipe(tap(res => this.handleAuth(res)));
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.api}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.api}/auth/reset-password`, { token, newPassword });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
