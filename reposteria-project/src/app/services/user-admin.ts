import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
  role?: string; // opcional, el backend lo ignora y fuerza 'admin'
}

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private apiUrl = 'http://localhost:8000/api/admin'; // Laravel

  constructor(private http: HttpClient) { }

  createAdmin(userData: CreateAdminRequest): Observable<any> {
    // Aunque mandes role, el backend lo ignora y pone 'admin'
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
}