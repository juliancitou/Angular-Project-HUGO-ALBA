import { Routes } from '@angular/router';  // ← Agregar esta importación
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';

// Si no tienes DashboardComponent, comenta o elimina esta ruta
// import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'acerca', component: AboutComponent },
    { path: 'login', component: LoginComponent },  // ← 'login' en minúscula
    // {
    //     path: 'dashboard',
    //     component: DashboardComponent,
    //     canActivate: [AuthGuard]
    // },
    { path: '**', redirectTo: '' }  // ← Comodín correcto
];