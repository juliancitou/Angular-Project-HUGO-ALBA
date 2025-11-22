import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';

// Rutas del admin (usando loadComponent porque son standalone)
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'acerca', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'productos', component: ProductsComponent },

    // RUTAS DEL PANEL ADMIN
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin').then(m => m.AdminComponent),
        // canActivate: [AdminGuard], // ← Descomenta cuando ya tengas el guard
    },
    {
        path: 'admin/create-admin',
        loadComponent: () => import('./components/admin/create-admin/create-admin').then(m => m.CreateAdminComponent),
        // canActivate: [AdminGuard],
    },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];