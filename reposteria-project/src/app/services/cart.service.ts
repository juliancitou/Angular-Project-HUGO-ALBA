// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ✅ AGREGADO
import { Product } from '../models/product.model';

export interface CartItem {
  id: number;
  product_id: number; // ✅ AGREGADO: ID del producto
  product_name: string; // ✅ AGREGADO: Nombre persistente
  product_price: number; // ✅ AGREGADO: Precio persistente
  product_images: string[]; // ✅ AGREGADO: Imágenes persistentes
  quantity: number;
  price: number; // Precio al momento de agregar
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  public cart$ = this.cartSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadCartFromStorage();
  }

  private getCartStorageKey(): string {
    const userId = this.authService.getUserId() || 'guest_' + Math.random().toString(36).substr(2, 9);
    return `encanto_cart_${userId}`;
  }

  addToCart(product: any, quantity: number = 1): void {
    console.log('🛒 AGREGANDO:', product.name, 'Cantidad:', quantity); // DEBUG

    const existingItemIndex = this.cart.items.findIndex(item => item.product_id === product.id);

    if (existingItemIndex > -1) {
      this.cart.items[existingItemIndex].quantity += quantity;
      console.log('✅ ACTUALIZADO:', this.cart.items[existingItemIndex]);
    } else {
      const cartItem: CartItem = {
        id: Date.now() + Math.random(),
        product_id: product.id,
        product_name: product.name,
        product_price: Number(product.price),
        product_images: product.images || [],
        quantity,
        price: Number(product.price)
      };
      this.cart.items.push(cartItem);
      console.log('✅ NUEVO ITEM:', cartItem);
    }

    this.updateCart();
  }

  // ✅ CAMBIAR CANTIDAD
  updateQuantity(cartItemId: number, quantity: number): void {
    const itemIndex = this.cart.items.findIndex(item => item.id === cartItemId);
    if (itemIndex > -1 && quantity > 0) {
      this.cart.items[itemIndex].quantity = quantity;
      this.updateCart();
    } else if (quantity <= 0) {
      this.removeItem(cartItemId);
    }
  }

  // ✅ ELIMINAR ITEM
  removeItem(cartItemId: number): void {
    console.log('🗑️ ELIMINANDO:', cartItemId);
    this.cart.items = this.cart.items.filter(item => item.id !== cartItemId);
    this.updateCart();
  }

  // ✅ LIMPIAR CARRITO
  clearCart(): void {
    console.log('🧹 VACIANDO CARRITO');
    this.cart = { items: [], totalItems: 0, totalPrice: 0 };
    this.updateCart();
  }

  // ✅ ACTUALIZAR TOTALES
  private updateCart(): void {
    this.cart.totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    console.log('📊 CARRITO ACTUALIZADO:', {
      items: this.cart.items.length,
      totalItems: this.cart.totalItems,
      totalPrice: this.cart.totalPrice
    });

    this.cartSubject.next({ ...this.cart });
    this.saveCartToStorage();
  }

  // ✅ GUARDAR CON CLAVE ÚNICA POR USUARIO
  private saveCartToStorage(): void {
    const key = this.getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(this.cart.items, null, 2));
    console.log(`💾 GUARDADO en ${key}:`, this.cart.items.length, 'items');
  }

  // ✅ CARGAR CARRITO POR USUARIO
  private loadCartFromStorage(): void {
    const key = this.getCartStorageKey();
    console.log('🔍 CARGANDO desde:', key);

    const cartItemsString = localStorage.getItem(key);

    if (cartItemsString) {
      try {
        const items: CartItem[] = JSON.parse(cartItemsString);
        console.log('📦 ITEMS CARGADOS:', items.length);

        // ✅ VERIFICAR QUE LOS DATOS SEAN VÁLIDOS
        const validItems = items.filter(item =>
          item.id &&
          item.product_id &&
          item.product_name &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
        );

        console.log('✅ ITEMS VÁLIDOS:', validItems.length);
        this.cart.items = validItems;
        this.updateCart();

        if (validItems.length !== items.length) {
          console.warn('⚠️ Algunos items fueron eliminados por datos inválidos');
          this.saveCartToStorage(); // Guardar solo los válidos
        }
      } catch (error) {
        console.error('❌ ERROR cargando carrito:', error);
        this.clearCart();
      }
    } else {
      console.log('ℹ️ Carrito vacío para:', key);
    }
  }

  // ✅ CAMBIAR USUARIO (IMPORTANTE)
  // ✅ REEMPLAZAR el método switchUser() en cart.service.ts
  switchUser(): void {
    console.log('🔄 CAMBIANDO USUARIO...');

    // ✅ GUARDAR CARRITO ACTUAL ANTES DE CAMBIAR
    this.saveCartToStorage();

    // ✅ SOLO LIMPIAR SI ES NECESARIO
    const currentKey = this.getCartStorageKey();
    const newKey = this.authService.getUserId()
      ? `encanto_cart_${this.authService.getUserId()}`
      : `encanto_cart_guest_${Math.random().toString(36).substr(2, 9)}`;

    if (currentKey !== newKey) {
      console.log(`🔄 Cambiando de ${currentKey} a ${newKey}`);
      this.clearCart();
    }

    // ✅ CARGAR NUEVO CARRITO
    setTimeout(() => {
      this.loadCartFromStorage();
    }, 50);
  }

  // ✅ GETTERS
  getCart(): Cart {
    return this.cart;
  }

  getTotalItems(): number {
    return this.cart.totalItems;
  }

  getTotalPrice(): number {
    return this.cart.totalPrice;
  }
}