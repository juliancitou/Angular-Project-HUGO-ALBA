// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';

// COMPONENTE NUEVO: Crear Producto
import { CreateProductComponent } from './admin/create-product/create-product';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // ==================== ÁREA DE ADMINISTRACIÓN ====================
    {
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard], // Solo usuarios logueados + rol admin
        children: [
            // Dashboard principal (productos, pedidos, etc.)
            {
                path: '',
                component: AdminDashboardComponent
            },

            // Crear nuevo producto → componente independiente
            {
                path: 'create-product',
                loadComponent: () => import('./admin/create-product/create-product')
                    .then(m => m.CreateProductComponent),
                title: 'Crear Producto - Encanto Admin'
            },

            // Opcional: también puedes tener editar producto
            {
                path: 'edit-product/:id',
                loadComponent: () => import('./admin/edit-product/edit-product')
                    .then(m => m.EditProduct),
                title: 'Editar Producto - Encanto Admin'
            },

            // Si más adelante quieres separar órdenes, crear admin, etc.
            // { path: 'orders', component: OrdersComponent },
            // { path: 'create-admin', component: CreateAdminComponent },
        ]
    },

    // Ruta por defecto y wildcard
    { path: '**', redirectTo: '' }
];