// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // ← ASÍ SE IMPORTA, NO @angular/common/router
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ← CORRECTO: RouterModule aquí
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  getFirstImage(images: string[] | null): string {
    if (images && images.length > 0) {
      return `http://localhost:8000/storage/${images[0]}`;
    }
    return 'assets/default-product.jpg';
  }

  // ✅ AGREGAR ESTE MÉTODO EN product-list.component.ts
  getCategoryName(product: any): string {
    if (!product.category) return 'Sin categoría';

    // Si es objeto (viene de la API con with('category'))
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'Sin categoría';
    }

    // Si es string (nombre directo)
    return product.category.toString();
  }
}