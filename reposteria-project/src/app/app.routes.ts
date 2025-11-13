import { Routes } from '@angular/router';  // ← Agregar esta importación
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
// Si no tienes DashboardComponent, comenta o elimina esta ruta
// import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'acerca', component: AboutComponent },
    { path: 'register', component: RegisterComponent }, // ← Nueva ruta
    { path: 'login', component: LoginComponent }, // ← Esta ruta debe existir    // {
    //     path: 'dashboard',
    //     component: DashboardComponent,
    //     canActivate: [AuthGuard]
    // },
    { path: '**', redirectTo: '' }  // ← Comodín correcto
];