import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  // Token refresh lock — prevents concurrent refresh storms
  private _isRefreshing = false;
  private _refreshToken$ = new BehaviorSubject<string | null>(null);

  get isRefreshing(): boolean { return this._isRefreshing; }
  get refreshToken$(): Observable<string | null> { return this._refreshToken$.asObservable(); }

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

  /**
   * Initiates a token refresh. Returns null when no refresh token is available.
   * Callers should use the interceptor's lock pattern rather than calling this directly.
   */
  doRefresh(): Observable<AuthResponse> | null {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    return this.http.post<AuthResponse>(`${this.api}/auth/refresh`, { refreshToken })
      .pipe(tap(res => this.handleAuth(res)));
  }

  /** Called by the interceptor to mark a refresh as in-flight. */
  beginRefresh(): void {
    this._isRefreshing = true;
    this._refreshToken$.next(null);
  }

  /** Called by the interceptor when refresh succeeds. */
  completeRefresh(newToken: string): void {
    this._isRefreshing = false;
    this._refreshToken$.next(newToken);
  }

  /** Called by the interceptor when refresh fails. */
  failRefresh(): void {
    this._isRefreshing = false;
    this._refreshToken$.next(null);
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
