import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth';
  private readonly tokenKey = 'agojie_token';
  private readonly userKey = 'agojie_user';

  token = signal<string | null>(localStorage.getItem(this.tokenKey));
  user = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get isAuthenticated(): boolean {
    return !!this.token();
  }

  register(data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }): Observable<{ token: string; user: AuthUser }> {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.baseUrl}/register/`, data).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  login(username: string, password: string): Observable<{ token: string; user: AuthUser }> {
    return this.http.post<{ token: string; user: AuthUser }>(`${this.baseUrl}/login/`, { username, password }).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/me/`);
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private setSession(res: { token: string; user: AuthUser }): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
  }
}
