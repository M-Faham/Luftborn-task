import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/authenticated-layout/authenticated-layout.component').then(
        (c) => c.AuthenticatedLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/dashboard/components/tasks/tasks.component').then(
            (c) => c.TasksComponent,
          ),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
