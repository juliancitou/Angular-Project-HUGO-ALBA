import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${LARAVEL_API}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${LARAVEL_API}/register`, userData);
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    isAdmin(): boolean {  // ← AGREGAR ESTE MÉTODO
        const user = this.getUser();
        return user && user.role === 'admin'; // Ajusta según tu lógica de roles
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}