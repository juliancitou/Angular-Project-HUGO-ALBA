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

    // Nuevas propiedades para validación visual
    nameInvalid = false;
    emailInvalid = false;
    phoneInvalid = false;
    addressInvalid = false;
    passwordInvalid = false;
    confirmPasswordInvalid = false;
    submitted = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onRegister(): void {
        this.submitted = true;

        // Validar todos los campos antes de enviar
        this.validateAllFields();

        if (this.hasValidationErrors()) {
            this.errorMessage = 'Por favor, corrige los errores en el formulario.';
            this.isLoading = false;
            return;
        }

        // Validación de coincidencia de contraseñas
        if (this.userData.password !== this.userData.password_confirmation) {
            this.errorMessage = 'Las contraseñas no coinciden';
            this.passwordInvalid = true;
            this.confirmPasswordInvalid = true;
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        console.log('Datos a enviar:', this.userData);

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
                    this.highlightErrorFields(validationErrors);
                } else if (error.status === 500) {
                    this.errorMessage = 'Error del servidor. Intenta más tarde.';
                } else {
                    this.errorMessage = error.error?.message || 'Error en el registro';
                }

                this.triggerErrorAnimation();
            }
        });
    }

    // MÉTODOS DE VALIDACIÓN MEJORADOS
    validateAllFields(): void {
        this.validateName();
        this.validateEmail();
        this.validatePhone();
        this.validateAddress();
        this.validatePassword();
        this.validateConfirmPassword();
    }

    validateName(): void {
        if (this.submitted || this.userData.name) {
            this.nameInvalid = this.userData.name.length < 2;
        } else {
            this.nameInvalid = false;
        }
    }

    validateEmail(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.submitted || this.userData.email) {
            this.emailInvalid = !emailRegex.test(this.userData.email);
        } else {
            this.emailInvalid = false;
        }
    }

    validatePhone(): void {
        if (this.submitted && this.userData.phone) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            this.phoneInvalid = !phoneRegex.test(this.userData.phone);
        } else {
            this.phoneInvalid = false;
        }
    }

    validateAddress(): void {
        if (this.submitted && this.userData.address) {
            this.addressInvalid = this.userData.address.length < 10;
        } else {
            this.addressInvalid = false;
        }
    }

    validatePassword(): void {
        if (this.submitted || this.userData.password) {
            this.passwordInvalid = this.userData.password.length < 8;
        } else {
            this.passwordInvalid = false;
        }
    }

    validateConfirmPassword(): void {
        if (this.submitted || this.userData.password_confirmation) {
            this.confirmPasswordInvalid = this.userData.password_confirmation.length < 8 ||
                this.userData.password !== this.userData.password_confirmation;
        } else {
            this.confirmPasswordInvalid = false;
        }
    }

    // Validación en tiempo real
    onNameInput(): void {
        if (this.submitted || this.userData.name) {
            this.validateName();
        }
        this.clearErrorIfCorrecting();
    }

    onEmailInput(): void {
        if (this.submitted || this.userData.email) {
            this.validateEmail();
        }
        this.clearErrorIfCorrecting();
    }

    onPhoneInput(): void {
        if (this.submitted || this.userData.phone) {
            this.validatePhone();
        }
    }

    onAddressInput(): void {
        if (this.submitted || this.userData.address) {
            this.validateAddress();
        }
    }

    onPasswordInput(): void {
        if (this.submitted || this.userData.password) {
            this.validatePassword();
            this.validateConfirmPassword(); // Re-validar confirmación cuando cambia la contraseña
        }
        this.clearErrorIfCorrecting();
    }

    onConfirmPasswordInput(): void {
        if (this.submitted || this.userData.password_confirmation) {
            this.validateConfirmPassword();
        }
        this.clearErrorIfCorrecting();
    }

    // Limpiar errores
    clearNameError(): void {
        if (this.nameInvalid) {
            this.nameInvalid = false;
            this.clearErrorIfCorrecting();
        }
    }

    clearEmailError(): void {
        if (this.emailInvalid) {
            this.emailInvalid = false;
            this.clearErrorIfCorrecting();
        }
    }

    clearPasswordError(): void {
        if (this.passwordInvalid) {
            this.passwordInvalid = false;
            this.clearErrorIfCorrecting();
        }
    }

    clearConfirmPasswordError(): void {
        if (this.confirmPasswordInvalid) {
            this.confirmPasswordInvalid = false;
            this.clearErrorIfCorrecting();
        }
    }

    private clearErrorIfCorrecting(): void {
        if (this.errorMessage && !this.errorMessage.includes('servidor')) {
            this.errorMessage = '';
        }
    }

    // Verificar si hay errores de validación
    hasValidationErrors(): boolean {
        return this.nameInvalid || this.emailInvalid || this.phoneInvalid ||
            this.addressInvalid || this.passwordInvalid || this.confirmPasswordInvalid;
    }

    // Verificar si el formulario es válido
    isFormValid(): boolean {
        return !this.nameInvalid &&
            !this.emailInvalid &&
            !this.passwordInvalid &&
            !this.confirmPasswordInvalid &&
            this.userData.name.length >= 2 &&
            this.userData.email.length > 0 &&
            this.userData.password.length >= 8 &&
            this.userData.password_confirmation.length >= 8;
    }

    // INDICADOR DE FORTALEZA DE CONTRASEÑA
    getPasswordStrength(): number {
        const password = this.userData.password;
        if (!password) return 0;

        let strength = 0;

        // Longitud
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 10;

        // Complejidad
        if (/[a-z]/.test(password)) strength += 15;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

        return Math.min(strength, 100);
    }

    getPasswordStrengthClass(): string {
        const strength = this.getPasswordStrength();
        if (strength < 40) return 'weak';
        if (strength < 70) return 'medium';
        if (strength < 90) return 'strong';
        return 'very-strong';
    }

    getPasswordStrengthText(): string {
        const strength = this.getPasswordStrength();
        if (strength < 40) return 'Débil';
        if (strength < 70) return 'Media';
        if (strength < 90) return 'Fuerte';
        return 'Muy Fuerte';
    }

    // MÉTODOS EXISTENTES
    private formatValidationErrors(errors: any): string {
        if (!errors) return 'Error de validación';

        let message = '';
        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                const fieldName = this.translateFieldName(field);
                message += `${fieldName}: ${errors[field].join(', ')}. `;
            }
        }
        return message.trim() || 'Error de validación';
    }

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

    private highlightErrorFields(validationErrors: any): void {
        // Resetear todos los errores primero
        this.nameInvalid = false;
        this.emailInvalid = false;
        this.phoneInvalid = false;
        this.addressInvalid = false;
        this.passwordInvalid = false;
        this.confirmPasswordInvalid = false;

        // Resaltar campos con errores específicos
        for (const field in validationErrors) {
            switch (field) {
                case 'name':
                    this.nameInvalid = true;
                    break;
                case 'email':
                    this.emailInvalid = true;
                    break;
                case 'phone':
                    this.phoneInvalid = true;
                    break;
                case 'address':
                    this.addressInvalid = true;
                    break;
                case 'password':
                    this.passwordInvalid = true;
                    break;
                case 'password_confirmation':
                    this.confirmPasswordInvalid = true;
                    break;
            }
        }
    }

    private triggerErrorAnimation(): void {
        // Las animaciones se activan automáticamente mediante las clases CSS
        setTimeout(() => {
            // Forzar re-renderizado de animaciones si es necesario
        }, 100);
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}