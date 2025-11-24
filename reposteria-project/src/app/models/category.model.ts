// src/app/models/category.model.ts
export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    is_active?: boolean;
}