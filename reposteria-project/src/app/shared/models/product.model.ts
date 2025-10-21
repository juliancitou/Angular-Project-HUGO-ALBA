export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    images: string[];
    ingredients: string[];
    allergens: string[];
    stock: number;
    isAvailable: boolean;
    rating?: number;
    reviewCount?: number;
}

export interface CustomizationOption {
    id: number;
    name: string;
    options: string[];
    additionalCost?: number;
}

export enum ProductCategory {
    CAKES = 'Pasteles',
    CUPCAKES = 'Cupcakes',
    COOKIES = 'Galletas',
    DESSERTS = 'Postres',
    SPECIALS = 'Especiales'
}