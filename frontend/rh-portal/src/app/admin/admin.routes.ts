import { Routes } from '@angular/router';
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
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: EmployeeAddComponent },
  { path: 'employees/edit/:id', component: EmployeeEditComponent },
  { path: 'conges', component: CongeListComponent },
  { path: 'conges/validation', component: CongeValidationComponent },
  { path: 'paie', component: PaieListComponent },
  { path: 'paie/edit', component: PaieEditComponent }
];
