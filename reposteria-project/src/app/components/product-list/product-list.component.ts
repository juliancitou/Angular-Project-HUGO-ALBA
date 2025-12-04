// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service'; // ← AGREGADO

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  topProducts: Product[] = []; // ← Solo los 6 mejores

  constructor(
    private productService: ProductService,
    private cartService: CartService // ← AGREGADO
  ) { }

  ngOnInit(): void {
    this.loadTopProducts();
  }

  // ✅ CARGAR SOLO LOS 6 CON MÁS LIKES
  loadTopProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        // Filtrar disponibles + ordenar por likes + tomar solo 6
        this.topProducts = data
          .filter(p => p.is_available && p.stock > 0)
          .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
          .slice(0, 6);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  // ✅ AGREGAR AL CARRITO
  addToCart(product: Product, event: Event): void {
    event.stopPropagation(); // ← Evita ir al detalle
    if (product.stock > 0) {
      this.cartService.addToCart(product, 1);
      alert(`¡${product.name} agregado al carrito! 🎉`);
    } else {
      alert('Producto agotado');
    }
  }

  // ✅ IMAGEN
  getFirstImage(images: string[] | null): string {
    if (images && images.length > 0) {
      return `http://localhost:8000/storage/${images[0]}`;
    }
    return 'assets/default-product.jpg';
  }

  // ✅ CATEGORÍA
  getCategoryName(product: any): string {
    if (!product.category) return 'Sin categoría';
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'Sin categoría';
    }
    return product.category.toString();
  }

  // Añade este método a tu component.ts
  getProductRating(position: number): number {
    // Lógica para calcular rating basado en posición
    // Puedes ajustar esta lógica según tus necesidades
    if (position === 0) return 5; // Primer lugar: 5 estrellas
    if (position === 1) return 4; // Segundo lugar: 4 estrellas
    if (position === 2) return 4; // Tercer lugar: 4 estrellas
    return 3; // Resto: 3 estrellas
  }
}