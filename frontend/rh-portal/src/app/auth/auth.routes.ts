import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - Portail RH'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription - Portail RH'
  }
];
