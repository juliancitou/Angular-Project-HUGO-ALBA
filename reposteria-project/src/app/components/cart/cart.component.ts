// src/app/pages/cart/cart.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent], // ✅ HEADER QUITADO
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      this.cartItems = cart.items;
      this.totalPrice = cart.totalPrice;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ ACTUALIZAR CANTIDAD
  updateQuantity(cartItem: CartItem, quantity: number): void {
    const safeQuantity = Math.max(1, Number(quantity));
    this.cartService.updateQuantity(cartItem.id, safeQuantity);
  }

  // ✅ ELIMINAR ITEM
  removeItem(cartItemId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      this.cartService.removeItem(cartItemId);
    }
  }

  // ✅ LIMPIAR CARRITO
  clearCart(): void {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      this.cartService.clearCart();
    }
  }

  // ✅ OBTENER NOMBRE DE CATEGORÍA
  getCategoryName(item: any): string {
    return 'Producto'; // ✅ Simplificado
  }

  // ✅ OBTENER PRIMERA IMAGEN
  getFirstImage(item: any): string {
    if (item.product_images && item.product_images.length > 0) {
      return `http://localhost:8000/storage/${item.product_images[0]}`;
    }
    return 'assets/no-image.png';
  }
}