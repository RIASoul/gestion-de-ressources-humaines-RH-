import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(ReactiveFormsModule),
  ],
}).catch(err => console.error(err));
