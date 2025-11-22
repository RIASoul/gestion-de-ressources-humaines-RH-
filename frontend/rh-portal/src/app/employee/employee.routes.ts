import { Routes } from '@angular/router';
import { employeeGuard } from '../core/guards/employee.guard';
import {
  EmployeeDashboardComponent,
  MesCongesComponent,
  MesPaieComponent,
  ProfileComponent
} from './index';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: EmployeeDashboardComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'mes-conges', 
    component: MesCongesComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'mes-paie', 
    component: MesPaieComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [employeeGuard]
  },
];
