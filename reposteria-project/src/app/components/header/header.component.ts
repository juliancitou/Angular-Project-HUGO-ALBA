import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService, Cart } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';

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
  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 }; // ✅ AGREGADO
  menuItems = [
    { name: 'Inicio', path: '/', icon: 'bi bi-house-door' },
    { name: 'Todos los Productos', path: '/productos', icon: 'bi bi-grid-3x3-gap' },
    { name: 'Destacados', path: '/destacados', icon: 'bi bi-star-fill' },
    { name: 'Acerca de', path: '/acerca', icon: 'bi bi-info-circle' },
  ];

  private intervalId: any;
  private destroy$ = new Subject<void>(); // ✅ AGREGADO

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService // ✅ AGREGADO
  ) { }

  // En header.component.ts, MODIFICAR ngOnInit():
  // ✅ REEMPLAZAR la suscripción en header.component.ts ngOnInit()
  ngOnInit(): void {
    this.updateAuthStatus();

    // ✅ SUSCRIBIRSE AL CARRITO
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      this.cart = cart;
    });

    // ✅ SOLO CAMBIAR CARRITO EN CAMBIOS REALES DE USUARIO
    this.authService.userChange$.pipe(takeUntil(this.destroy$)).subscribe((newUser) => {
      const wasLoggedIn = this.isLoggedIn;
      this.updateAuthStatus();
      const isNowLoggedIn = this.isLoggedIn;

      // ✅ SOLO EJECUTAR SI REALMENTE CAMBIÓ EL ESTADO DE AUTENTICACIÓN
      if (wasLoggedIn !== isNowLoggedIn) {
        console.log('🔄 AUTENTICACIÓN CAMBIÓ, recargando carrito...');
        this.cartService.switchUser();
      }
    });

    this.intervalId = setInterval(() => {
      this.updateAuthStatus();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.destroy$.next(); // ✅ AGREGADO
    this.destroy$.complete(); // ✅ AGREGADO
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