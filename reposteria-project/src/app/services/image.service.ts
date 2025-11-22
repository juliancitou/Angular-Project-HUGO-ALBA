import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const LARAVEL_API = 'http://localhost:8000/api';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);

        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
            // NO agregar 'Content-Type' - se genera automáticamente
        });

        return this.http.post(`${LARAVEL_API}/images/upload`, formData, { headers });
    }

    deleteImage(path: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.delete(`${LARAVEL_API}/images/delete`, {
            headers,
            body: { path: path }
        });
    }
}