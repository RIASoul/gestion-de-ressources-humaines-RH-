import { Routes } from '@angular/router';
import {
  EmployeeDashboardComponent,
  MesCongesComponent,
  MesPaieComponent,
  ProfileComponent
} from './index';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: EmployeeDashboardComponent },
  { path: 'mes-conges', component: MesCongesComponent },
  { path: 'mes-paie', component: MesPaieComponent },
  { path: 'profile', component: ProfileComponent },
];
