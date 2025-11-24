// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../admin/admin-dashboard.component';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminDashboardComponent,
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', component: AdminDashboardComponent },
            { path: 'orders', component: AdminDashboardComponent },
            { path: 'create-admin', component: AdminDashboardComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }