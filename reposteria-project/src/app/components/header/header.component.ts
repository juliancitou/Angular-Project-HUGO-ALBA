import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // ← Agregar esta importación

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  brandName = 'Encanto';
  isLoggedIn = false;
  isAdmin = false;
  userName = '';

  menuItems = [
    { name: 'Inicio', path: '/', icon: 'bi bi-house' },
    { name: 'Productos', path: '/productos', icon: 'bi bi-basket' },
    { name: 'Acerca de', path: '/acerca', icon: 'bi bi-info-circle' },
  ];

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAuthStatus();

    // Escuchar cambios en el estado de autenticación
    // Esto se puede mejorar con un Observable en el futuro
    setInterval(() => {
      this.checkAuthStatus();
    }, 1000);
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();

    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userName = user?.name || 'Usuario';
    } else {
      this.userName = '';
    }
  }

  // En el método logout, simplificar sin recargar página
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userName = '';
        // Navegar al home en lugar de recargar
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Forzar logout localmente
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userName = '';
        this.router.navigate(['/']);
      }
    });
  }
}