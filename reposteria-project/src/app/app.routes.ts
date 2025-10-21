import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./modules/client/components/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./modules/client/components/product-list/product-list.component').then(c => c.ProductListComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./modules/client/components/product-detail/product-detail.component').then(c => c.ProductDetailComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./modules/client/components/shopping-cart/shopping-cart.component').then(c => c.ShoppingCartComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/routes/admin.routes').then(r => r.ADMIN_ROUTES)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/routes/auth.routes').then(r => r.AUTH_ROUTES)
    },
    { path: '**', redirectTo: '' }
];