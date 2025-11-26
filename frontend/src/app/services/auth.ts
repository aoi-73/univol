import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario, Token, LoginRequest, UsuarioCreate, RolEnum } from '../models/user.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'access_token';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  register(user: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiConfig.getApiUrl('/registro/'), user).pipe(
      tap((newUser) => {
        // Después del registro, hacer login automático
        this.loginWithCredentials(user.correo, user.contrasena).subscribe({
          next: () => {
            // Guardar información del usuario registrado
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            this.currentUserSubject.next(newUser);
          }
        });
      })
    );
  }

  loginWithCredentials(correo: string, contrasena: string): Observable<Token> {
    const formData = new FormData();
    formData.append('username', correo);
    formData.append('password', contrasena);

    return this.http.post<Token>(this.apiConfig.getApiUrl('/token'), formData).pipe(
      tap((token) => {
        this.setToken(token.access_token);
        // Guardar el correo temporalmente para usarlo en loadUserProfile
        this.loadUserProfile(correo).subscribe();
      })
    );
  }

  private loadUserProfile(correo?: string): Observable<Usuario> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    // Obtener información completa del usuario desde el backend
    return this.http.get<Usuario>(this.apiConfig.getApiUrl('/usuarios/me')).pipe(
      tap((user) => {
        // Guardar el usuario completo con el rol correcto
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  isOrganization(): boolean {
    return this.currentUserValue?.rol === 'organizacion';
  }

  isPostulante(): boolean {
    return this.currentUserValue?.rol === 'postulante';
  }
}
