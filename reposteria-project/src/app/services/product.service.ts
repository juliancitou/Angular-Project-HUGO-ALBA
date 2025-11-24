// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${API_URL}/products`).pipe(
            catchError(err => {
                console.error('Error cargando productos:', err);
                return throwError(() => err);
            })
        );
    }

    // Añade esto dentro de tu ProductService (debajo de getProducts() por ejemplo)

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL}/categories`).pipe(
            catchError(err => {
                console.error('Error cargando categorías:', err);
                return throwError(() => err);
            })
        );
    }
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${API_URL}/products/${id}`);
    }

    // ==================== MÉTODOS PARA ADMIN ====================

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        });
    }

    createProduct(product: FormData): Observable<Product> {
        const token = this.authService.getToken();   // ← AÑADE ESTA LÍNEA

        return this.http.post<Product>(`${API_URL}/products`, product, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        });
    }

    updateProduct(id: number | string, product: FormData): Observable<Product> {
        const token = this.authService.getToken();   // ← AÑADE ESTA LÍNEA

        return this.http.post<Product>(`${API_URL}/products/${id}`, product, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        });
    }

    deleteProduct(id: number | string): Observable<any> {
        const token = this.authService.getToken();   // ← AÑADE ESTA LÍNEA

        return this.http.delete(`${API_URL}/products/${id}`, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        });
    }
}