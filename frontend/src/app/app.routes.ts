import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.default),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard-page.component').then(m => m.default) },
      { path: 'assets', loadChildren: () => import('./features/assets/assets.routes').then(m => m.ASSET_ROUTES) },
      { path: '', pathMatch: 'full', redirectTo: 'assets' } // default -> Assets
    ],
  },
  { path: '**', redirectTo: '' },
];
