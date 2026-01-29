import { Routes } from '@angular/router';

export const routes: Routes = [
   
    { path: '', redirectTo: 'library', pathMatch: 'full' },

    {
        path: 'add-track',
        loadComponent: () => import('./features/track-manager/track-manager.component')
            .then(m => m.TrackManagerComponent)
    },

    {
        path: 'library',
        loadComponent: () => import('./features/library/library.component')
            .then(m => m.LibraryComponent)
    },

    {
        path: 'edit-track/:id',
        loadComponent: () => import('./features/track-manager/track-manager.component')
            .then(m => m.TrackManagerComponent)
    },

    {
        path: 'track/:id',
        loadComponent: () => import('./features/track-detail/track-detail.component')
            .then(m => m.TrackDetailComponent)
    },

  
    { path: '**', redirectTo: 'library' },
];