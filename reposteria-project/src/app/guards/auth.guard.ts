import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // ← Corregir import
import { AuthService } from '../services/auth.service';  // ← Ruta correcta
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {  // ← Corregir nombre del método
            return true;
        } else {
            this.router.navigate(['/login']); // ← Corregir llaves
            return false;
        }
    }
}