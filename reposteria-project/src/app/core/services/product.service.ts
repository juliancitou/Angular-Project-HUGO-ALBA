import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, ProductCategory } from '../../shared/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: Product[] = [
        {
            id: 1,
            name: 'Pastel de Chocolate Clásico',
            description: 'Delicioso pastel de chocolate con crema de mantequilla',
            price: 350,
            category: ProductCategory.CAKES,
            images: ['assets/images/chocolate-cake.jpg'],
            ingredients: ['Harina', 'Chocolate', 'Huevos', 'Mantequilla', 'Azúcar'],
            allergens: ['Gluten', 'Huevos', 'Lácteos'],
            stock: 5,
            isAvailable: true,
            rating: 4.8,
            reviewCount: 24
        },
        {
            id: 2,
            name: 'Cupcakes de Vainilla',
            description: 'Esponjosos cupcakes de vainilla con frosting de crema',
            price: 25,
            category: ProductCategory.CUPCAKES,
            images: ['assets/images/vanilla-cupcakes.jpg'],
            ingredients: ['Harina', 'Vainilla', 'Huevos', 'Mantequilla', 'Azúcar'],
            allergens: ['Gluten', 'Huevos', 'Lácteos'],
            stock: 12,
            isAvailable: true,
            rating: 4.5,
            reviewCount: 18
        }
    ];

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        // Simulamos llamada HTTP - luego conectaremos con backend real
        return of(this.products);
    }

    getProductById(id: number): Observable<Product | undefined> {
        const product = this.products.find(p => p.id === id);
        return of(product);
    }

    getProductsByCategory(category: ProductCategory): Observable<Product[]> {
        const filteredProducts = this.products.filter(p => p.category === category);
        return of(filteredProducts);
    }

    updateProductStock(productId: number, newStock: number): Observable<boolean> {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.stock = newStock;
            return of(true);
        }
        return of(false);
    }
}