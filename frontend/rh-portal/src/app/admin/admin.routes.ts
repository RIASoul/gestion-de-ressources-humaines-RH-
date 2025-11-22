import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import {
  AdminDashboardComponent,
  EmployeeListComponent,
  EmployeeAddComponent,
  EmployeeEditComponent,
  CongeListComponent,
  CongeValidationComponent,
  PaieListComponent,
  PaieEditComponent
} from './index';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees', 
    component: EmployeeListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees/add', 
    component: EmployeeAddComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees/edit/:id', 
    component: EmployeeEditComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'conges', 
    component: CongeListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'conges/validation', 
    component: CongeValidationComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'paie', 
    component: PaieListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'paie/edit', 
    component: PaieEditComponent,
    canActivate: [adminGuard]
  }
];
