import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient,
        private authService: AuthService // ← AGREGAR AuthService
    ) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${LARAVEL_API}/products`);
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${LARAVEL_API}/products/${id}`);
    }

    // MÉTODOS PROTEGIDOS (SOLO ADMIN) - AGREGAR HEADERS
    createProduct(productData: Product): Observable<Product> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<Product>(`${LARAVEL_API}/products`, productData, { headers });
    }

    updateProduct(id: number, productData: Product): Observable<Product> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.put<Product>(`${LARAVEL_API}/products/${id}`, productData, { headers });
    }

    deleteProduct(id: number): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${LARAVEL_API}/products/${id}`, { headers });
    }
}