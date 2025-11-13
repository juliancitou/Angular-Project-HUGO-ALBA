import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from '../app/components/products/products.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'acerca', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'productos', component: ProductsComponent },

    // Comentar temporalmente hasta crear el componente admin
    // {
    //     path: 'admin',
    //     loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    //     canActivate: [AdminGuard]
    // },

    { path: '**', redirectTo: '' }
];