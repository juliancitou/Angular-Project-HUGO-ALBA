import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
            return true;
        } else {
            // Redirigir a login si no está autenticado, o a home si no es admin
            if (!this.authService.isLoggedIn()) {
                this.router.navigate(['/login']);
            } else {
                this.router.navigate(['/']);
            }
            return false;
        }
    }
}