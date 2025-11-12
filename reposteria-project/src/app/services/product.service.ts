import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; // ← Importar interface

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> { // ← Especificar tipo de retorno
        return this.http.get<Product[]>(`${LARAVEL_API}/products`);
    }

    getProduct(id: number): Observable<Product> { // ← Tipo específico
        return this.http.get<Product>(`${LARAVEL_API}/products/${id}`);
    }

    createProduct(productData: Product): Observable<Product> { // ← Usar interface
        return this.http.post<Product>(`${LARAVEL_API}/products`, productData);
    }

    updateProduct(id: number, productData: Product): Observable<Product> {
        return this.http.put<Product>(`${LARAVEL_API}/products/${id}`, productData);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${LARAVEL_API}/products/${id}`);
    }
}