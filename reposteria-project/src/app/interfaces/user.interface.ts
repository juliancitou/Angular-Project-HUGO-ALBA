export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    is_admin: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}