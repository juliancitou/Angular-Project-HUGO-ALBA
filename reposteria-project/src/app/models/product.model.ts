export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number; // ← AGREGAR
    image_url: string; // ← AGREGAR
    is_available: boolean; // ← AGREGAR
    created_at?: string;
    updated_at?: string;
}