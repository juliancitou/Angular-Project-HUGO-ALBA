import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  brandName = 'Encanto';
  isLoggedIn = false;
  isAdmin = false;
  userName = '';

  menuItems = [
    { name: 'Inicio', path: '/', icon: 'bi bi-house-door' },
    { name: 'Productos', path: '/productos', icon: 'bi bi-basket' },
    { name: 'Acerca de', path: '/acerca', icon: 'bi bi-info-circle' },
  ];

  private intervalId: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateAuthStatus();

    // Escuchar cambios en tiempo real (mejor que setInterval)
    this.intervalId = setInterval(() => {
      this.updateAuthStatus();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();

    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userName = user?.name || 'Usuario';
    } else {
      this.userName = '';
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userName = '';
        this.router.navigate(['/']);
      },
      error: () => {
        // Aunque falle el backend, forzamos cierre local
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userName = '';
        this.router.navigate(['/']);
      }
    });
  }
}