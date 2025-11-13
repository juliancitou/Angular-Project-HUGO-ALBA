import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    userData = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: ''
    };

    isLoading = false;
    errorMessage = '';
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onRegister(): void {
        this.isLoading = true;
        this.errorMessage = '';

        // Validación básica
        if (this.userData.password !== this.userData.password_confirmation) {
            this.errorMessage = 'Las contraseñas no coinciden';
            this.isLoading = false;
            return;
        }

        this.authService.register(this.userData).subscribe({
            next: (response) => {
                this.isLoading = false;
                // Auto-login después del registro
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Error en el registro';
            }
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}