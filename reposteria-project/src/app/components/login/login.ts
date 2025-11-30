import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  // Nuevas propiedades para validación visual
  emailInvalid = false;
  passwordInvalid = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.submitted = true;

    // Validar campos antes de enviar
    this.validateEmail();
    this.validatePassword();

    if (this.emailInvalid || this.passwordInvalid) {
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // CORREGIDO: ahora verifica el campo 'role' que sí existe
        if (response.user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Mensajes más claros
        if (error.status === 422) {
          this.errorMessage = 'Las credenciales son incorrectas.';
          // Resaltar campos como incorrectos
          this.emailInvalid = true;
          this.passwordInvalid = true;
        } else if (error.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos.';
          this.emailInvalid = true;
          this.passwordInvalid = true;
        } else if (error.status === 404) {
          this.errorMessage = 'Usuario no encontrado.';
          this.emailInvalid = true;
        } else {
          this.errorMessage = error.error?.message || 'Error al conectar con el servidor';
        }

        // Agregar animación de error
        this.triggerErrorAnimation();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Validación de email
  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.submitted || this.credentials.email) {
      this.emailInvalid = !emailRegex.test(this.credentials.email);
    } else {
      this.emailInvalid = false;
    }
  }

  // Validación de contraseña
  validatePassword(): void {
    if (this.submitted || this.credentials.password) {
      this.passwordInvalid = this.credentials.password.length < 6;
    } else {
      this.passwordInvalid = false;
    }
  }

  // Validación en tiempo real mientras el usuario escribe
  onEmailInput(): void {
    if (this.submitted || this.credentials.email) {
      this.validateEmail();
    }
    // Limpiar mensaje de error general si el usuario está corrigiendo
    if (this.errorMessage && this.credentials.email) {
      this.errorMessage = '';
    }
  }

  onPasswordInput(): void {
    if (this.submitted || this.credentials.password) {
      this.validatePassword();
    }
    // Limpiar mensaje de error general si el usuario está corrigiendo
    if (this.errorMessage && this.credentials.password) {
      this.errorMessage = '';
    }
  }

  // Animación para resaltar errores
  private triggerErrorAnimation(): void {
    // Esta función activa las clases CSS para la animación
    // Las clases ya están definidas en el CSS con las animaciones
    setTimeout(() => {
      // Las animaciones se activan automáticamente mediante las clases
      // 'error' en los form-group
    }, 100);
  }

  // Limpiar errores cuando el usuario empiece a corregir
  clearEmailError(): void {
    if (this.emailInvalid) {
      this.emailInvalid = false;
      this.errorMessage = '';
    }
  }

  clearPasswordError(): void {
    if (this.passwordInvalid) {
      this.passwordInvalid = false;
      this.errorMessage = '';
    }
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return !this.emailInvalid &&
      !this.passwordInvalid &&
      this.credentials.email.length > 0 &&
      this.credentials.password.length >= 6;
  }
}