// src/app/models/product.model.ts
export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// ✅ TIPO FLEXIBLE: string | objeto
export type CategoryType = string | Category | null;

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: CategoryType;        // ✅ FLEXIBLE
    category_id: number | null;
    stock: number;
    is_available: boolean;
    images: string[] | null;
    slug?: string;
    likes_count: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}