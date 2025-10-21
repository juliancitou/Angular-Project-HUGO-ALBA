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
    { path: '**', redirectTo: '' }
];