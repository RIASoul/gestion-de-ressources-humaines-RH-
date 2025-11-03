import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Ton API Gateway redirige vers ton microservice Auth
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // ================================
  // 🔹 LOGIN
  // ================================
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  // ================================
  // 🔹 REGISTER
  // ================================
  register(user: { name: string; email: string; password: string; role?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // ================================
  // 🔹 SAVE / GET USER
  // ================================
  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ================================
  // 🔹 TOKEN MANAGEMENT
  // ================================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================================
  // 🔹 LOGOUT
  // ================================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ================================
  // 🔹 GET ROLE
  // ================================
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  // ================================
  // 🔹 IS ADMIN / IS EMPLOYEE
  // ================================
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.getUserRole() === 'EMPLOYEE';
  }
}
