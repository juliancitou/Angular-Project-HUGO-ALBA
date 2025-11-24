// src/app/models/product.model.ts
export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    category_id?: number;
    stock: number;
    is_available: boolean;
    images: string[];           // ← ¡¡ESTO ES CLAVE!! (JSONB en Laravel)
    slug?: string;
    created_at?: string;
    updated_at?: string;
}