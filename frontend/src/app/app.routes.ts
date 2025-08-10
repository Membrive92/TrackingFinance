import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.default),
    children: [
      {
        path: 'assets',
        loadChildren: () =>
          import('./features/assets/assets.routes').then(m => m.ASSET_ROUTES),
      },
      { path: '', pathMatch: 'full', redirectTo: 'assets' },
    ],
  },
  { path: '**', redirectTo: '' },
];
