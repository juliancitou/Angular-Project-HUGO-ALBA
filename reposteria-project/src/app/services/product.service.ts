import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    getFeaturedProducts(): Product[] {
        return [
            {
                id: 1,
                name: 'Pastel de Chocolate Clásico',
                description: 'Delicioso pastel de chocolate con crema de mantequilla y decorado con fresas frescas',
                price: 350,
                category: 'Pasteles'
            },
            {
                id: 2,
                name: 'Cupcakes de Vainilla',
                description: 'Esponjosos cupcakes de vainilla con frosting de crema y sprinkles coloridos',
                price: 25,
                category: 'Cupcakes'
            },
            {
                id: 3,
                name: 'Galletas de Mantequilla',
                description: 'Crujientes galletas de mantequilla con chispas de chocolate',
                price: 15,
                category: 'Galletas'
            }
        ];
    }
}