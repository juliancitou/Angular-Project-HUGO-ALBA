export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    is_available: boolean;
    images: string[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}