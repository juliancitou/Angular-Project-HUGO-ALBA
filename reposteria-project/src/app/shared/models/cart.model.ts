// Primero definimos Product aquí temporalmente o importamos
export interface Product {
    id: number;
    name: string;
    price: number;
    // ... otras propiedades básicas
}

export interface CartItem {
    product: Product;
    quantity: number;
    customization?: { [key: string]: string };
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}