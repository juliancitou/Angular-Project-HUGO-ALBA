// src/app/models/product.model.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    // añade más propiedades según necesites
}