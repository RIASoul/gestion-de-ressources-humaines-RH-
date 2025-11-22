import { environment } from '../../environments/environment';

export const AppConfig = {
  roles: {
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE'
  },
  endpoints: {
    AUTH: `${environment.apiUrl}/auth`,
    EMPLOYEE: `${environment.apiUrl}/employees`,
    CONGE: `${environment.apiUrl}/conges`,
    NOTIFICATION: `${environment.apiUrl}/notifications`,
    PAIE: `${environment.apiUrl}/paie`
  }
};
