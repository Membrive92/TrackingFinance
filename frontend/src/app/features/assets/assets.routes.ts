import { Routes } from '@angular/router';

export const ASSET_ROUTES: Routes = [
  { path: '',    loadComponent: () => import('./asset-list.component').then(m => m.default) },
  { path: 'new', loadComponent: () => import('./asset-form.component').then(m => m.default) },
];
