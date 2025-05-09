import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistropruebasComponent } from './pages/registropruebas/registropruebas.component';
import { HomeuserComponent } from './pages/homeuser/homeuser.component';

export const routes: Routes = [
{
    path:'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { requiresLogin: true, requiresAdmin: false } 
 },
 {
   path:'registropruebas',
   component:RegistropruebasComponent,
   canActivate: [AuthGuard],
   data: { requiresLogin: true, requiresAdmin: true }
 },
 {
   path:'login',
   component:LoginComponent,
   canActivate: [AuthGuard],
   data: { requiresLogin: false }
 },
 {
  path: 'homeuser',
  component: HomeuserComponent,
  canActivate: [AuthGuard],
  data: { requiresLogin: true, requiresAdmin: false }
 },
 {
    path: '**',
    redirectTo: 'homeuser',
    pathMatch: 'full'
 }
];
