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

        console.log('Datos a enviar:', this.userData);

        // Validación básica
        if (this.userData.password !== this.userData.password_confirmation) {
            this.errorMessage = 'Las contraseñas no coinciden';
            this.isLoading = false;
            return;
        }

        this.authService.register(this.userData).subscribe({
            next: (response) => {
                console.log('Registro exitoso:', response);
                this.isLoading = false;

                // El usuario ya se guarda automáticamente en el servicio
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Error completo:', error);
                this.isLoading = false;

                if (error.status === 422) {
                    const validationErrors = error.error.errors;
                    this.errorMessage = this.formatValidationErrors(validationErrors);
                } else if (error.status === 500) {
                    this.errorMessage = 'Error del servidor. Intenta más tarde.';
                } else {
                    this.errorMessage = error.error?.message || 'Error en el registro';
                }
            }
        });
    }

    // MÉTODO QUE FALTABA - Formatear errores de validación de Laravel
    private formatValidationErrors(errors: any): string {
        if (!errors) return 'Error de validación';

        let message = '';
        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                // Convertir nombres de campos a español
                const fieldName = this.translateFieldName(field);
                message += `${fieldName}: ${errors[field].join(', ')}. `;
            }
        }
        return message.trim() || 'Error de validación';
    }

    // Traducir nombres de campos al español
    private translateFieldName(field: string): string {
        const translations: { [key: string]: string } = {
            'name': 'Nombre',
            'email': 'Correo electrónico',
            'password': 'Contraseña',
            'password_confirmation': 'Confirmar contraseña',
            'phone': 'Teléfono',
            'address': 'Dirección'
        };

        return translations[field] || field;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}