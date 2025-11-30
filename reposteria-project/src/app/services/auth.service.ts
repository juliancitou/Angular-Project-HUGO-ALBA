import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs'; // ✅ AGREGADO BehaviorSubject
import { throwError } from 'rxjs';

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // ✅ OBSERVABLES PARA CAMBIOS DE USUARIO
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();
    public userChange$ = new BehaviorSubject<any>(null); // ✅ CRÍTICO PARA CARRITO

    constructor(private http: HttpClient) {
        // ✅ CARGAR USUARIO ACTUAL AL INICIAR
        this.loadCurrentUser();
    }

    // ✅ CARGAR USUARIO DESDE LOCALSTORAGE
    private loadCurrentUser(): void {
        const user = this.getUser();
        if (user) {
            this.userSubject.next(user);
            this.userChange$.next(user);
        }
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${LARAVEL_API}/register`, userData).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    // ✅ NOTIFICAR CAMBIO DE USUARIO
                    this.userSubject.next(response.user);
                    this.userChange$.next(response.user);
                    console.log('✅ Usuario registrado y carrito actualizado');
                }
            })
        );
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${LARAVEL_API}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    // ✅ NOTIFICAR CAMBIO DE USUARIO (CRÍTICO PARA CARRITO)
                    this.userSubject.next(response.user);
                    this.userChange$.next(response.user);
                    console.log(`✅ Usuario ${response.user.name} logueado, carrito actualizado`);
                }
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${LARAVEL_API}/logout`, {}).pipe(
            tap(() => {
                this.clearLocalStorage();
                // ✅ NOTIFICAR CAMBIO DE USUARIO (A NULL)
                this.userSubject.next(null);
                this.userChange$.next(null);
                console.log('✅ Usuario deslogueado, carrito de invitado activado');
            }),
            catchError(error => {
                this.clearLocalStorage();
                // ✅ NOTIFICAR CAMBIO INCLUSO EN ERROR
                this.userSubject.next(null);
                this.userChange$.next(null);
                console.log('✅ Logout forzado, carrito de invitado activado');
                return throwError(() => error);
            })
        );
    }

    getCurrentUser(): Observable<any> {
        return this.http.get(`${LARAVEL_API}/user`);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    isAdmin(): boolean {
        const user = this.getUser();
        return user && user.role === 'admin';
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // ✅ MÉTODO PARA VERIFICAR SI ES INVITADO
    isGuest(): boolean {
        return !this.isLoggedIn();
    }

    // ✅ MÉTODO PARA OBTENER ID DE USUARIO (PARA CARRITO)
    getUserId(): string | null {
        const user = this.getUser();
        return user?.id?.toString() || null;
    }

    private clearLocalStorage(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}