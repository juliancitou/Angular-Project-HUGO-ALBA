import { Injectable } from '@angular/core';
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
            description: 'Delicioso pastel de chocolate con crema de mantequilla y decorado con fresas frescas',
            price: 350,
            category: ProductCategory.CAKES,
            images: ['https://via.placeholder.com/400x300/FF6B8B/FFFFFF?text=Pastel+Chocolate'],
            ingredients: ['Harina', 'Chocolate', 'Huevos', 'Mantequilla', 'Azúcar', 'Fresas'],
            allergens: ['Gluten', 'Huevos', 'Lácteos'],
            stock: 5,
            isAvailable: true,
            rating: 4.8,
            reviewCount: 24
        },
        {
            id: 2,
            name: 'Cupcakes de Vainilla',
            description: 'Esponjosos cupcakes de vainilla con frosting de crema y sprinkles coloridos',
            price: 25,
            category: ProductCategory.CUPCAKES,
            images: ['https://via.placeholder.com/400x300/FFD166/FFFFFF?text=Cupcakes+Vainilla'],
            ingredients: ['Harina', 'Vainilla', 'Huevos', 'Mantequilla', 'Azúcar', 'Sprinkles'],
            allergens: ['Gluten', 'Huevos', 'Lácteos'],
            stock: 12,
            isAvailable: true,
            rating: 4.5,
            reviewCount: 18
        },
        {
            id: 3,
            name: 'Galletas de Mantequilla',
            description: 'Crujientes galletas de mantequilla con chispas de chocolate',
            price: 15,
            category: ProductCategory.COOKIES,
            images: ['https://via.placeholder.com/400x300/06D6A0/FFFFFF?text=Galletas+Mantequilla'],
            ingredients: ['Harina', 'Mantequilla', 'Azúcar', 'Chispas de Chocolate', 'Vainilla'],
            allergens: ['Gluten', 'Lácteos'],
            stock: 20,
            isAvailable: true,
            rating: 4.7,
            reviewCount: 32
        }
    ];

    getProducts(): Observable<Product[]> {
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
}