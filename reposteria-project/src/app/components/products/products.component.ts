// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
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
            error: (error) => {
                console.error('Error loading products:', error);
            }
        });
    }

    // FUNCIÓN CLAVE: obtiene la primera imagen del array JSONB
    getFirstImage(product: Product): string {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            return `http://localhost:8000/storage/${product.images[0]}`;
        }
        return 'assets/img/no-image.jpg'; // ← Crea esta imagen o usa una por defecto
    }
}