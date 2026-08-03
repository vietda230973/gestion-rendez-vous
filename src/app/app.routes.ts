import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'rendez-vous-list', loadComponent: () => import('./rendez-vous-list/rendez-vous-list').then(c => c.RendezVousList) },
  { path: 'rendezvous', loadComponent: () => import('./rendez-vous/rendez-vous').then(c => c.RendezVous) }  
];
