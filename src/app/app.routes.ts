import { Routes } from '@angular/router';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout/authenticated-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/authenticated-layout/authenticated-layout.component').then(
        (c) => c.AuthenticatedLayoutComponent,
      ),
  },
];
