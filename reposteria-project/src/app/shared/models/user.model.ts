export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    address?: string;
    role: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}