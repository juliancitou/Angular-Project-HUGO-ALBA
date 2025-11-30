// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { CreateProductComponent } from './admin/create-product/create-product';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // RUTA PÚBLICA DEL DETALLE DEL PRODUCTO
    {
        path: 'producto/:id',
        loadComponent: () => import('./components/product-detail/product-detail.component')
            .then(m => m.ProductDetailComponent),
        title: 'Detalle del Producto'
    },


    // RUTA PÚBLICA DE TODOS LOS PRODUCTOS
    {
        path: 'productos',
        loadComponent: () => import('./components/all-products/all-products.component')
            .then(m => m.AllProductsComponent),
        title: 'Todos los Productos - Encanto Repostería'
    },

    // AÑADE ESTAS DOS RUTAS (¡AHORA SÍ!)
    {
        path: 'productos',
        loadComponent: () => import('./components/product-list/product-list.component')
            .then(m => m.ProductListComponent),
        title: 'Nuestros Productos - Encanto Repostería'
    },
    {
        path: 'acerca',
        loadComponent: () => import('./components/about/about.component')
            .then(m => m.AboutComponent),
        title: 'Acerca de - Encanto Repostería'
    },

    //RUTA AL CARRITO DE COMPRAS
    { path: 'carrito', component: CartComponent },


    // ==================== ÁREA DE ADMINISTRACIÓN ====================
    {
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: '', component: AdminDashboardComponent },
            {
                path: 'create-product',
                loadComponent: () => import('./admin/create-product/create-product')
                    .then(m => m.CreateProductComponent),
                title: 'Crear Producto - Encanto Admin'
            },
            {
                path: 'edit-product/:id',
                loadComponent: () => import('./admin/edit-product/edit-product')
                    .then(m => m.EditProduct),
                title: 'Editar Producto - Encanto Admin'
            }
            // YA NO VA AQUÍ LA RUTA producto/:id
        ]
    },

    { path: '**', redirectTo: '' }
];