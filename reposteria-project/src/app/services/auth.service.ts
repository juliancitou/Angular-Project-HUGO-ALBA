import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs'; // ← Agregar catchError
import { throwError } from 'rxjs'; // ← Agregar throwError

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${LARAVEL_API}/register`, userData).pipe(
            tap((response: any) => {
                // Guardar usuario en localStorage (sin token)
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${LARAVEL_API}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${LARAVEL_API}/logout`, {}).pipe(
            tap(() => {
                // Limpiar localStorage
                localStorage.removeItem('user');
            }),
            catchError(error => {
                // Si hay error, igual limpiar localmente
                localStorage.removeItem('user');
                return throwError(() => error); // ← Sintaxis corregida
            })
        );
    }

    getCurrentUser(): Observable<any> {
        return this.http.get(`${LARAVEL_API}/user`);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('user');
    }

    isAdmin(): boolean {
        const user = this.getUser();
        return user && user.role === 'admin';
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}