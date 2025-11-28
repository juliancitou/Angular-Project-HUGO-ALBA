import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${LARAVEL_API}/register`, userData).pipe(
            tap((response: any) => {
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token); // ← AGREGAR TOKEN
                }
            })
        );
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${LARAVEL_API}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token); // ← AGREGAR TOKEN
                }
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${LARAVEL_API}/logout`, {}).pipe(
            tap(() => {
                this.clearLocalStorage();
            }),
            catchError(error => {
                this.clearLocalStorage();
                return throwError(() => error);
            })
        );
    }

    getCurrentUser(): Observable<any> {
        return this.http.get(`${LARAVEL_API}/user`);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token'); // ← CAMBIAR A TOKEN
    }

    isAdmin(): boolean {
        const user = this.getUser();
        return user && user.role === 'admin'; // ← Usar 'role' en lugar de 'is_admin'
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }   

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private clearLocalStorage(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}