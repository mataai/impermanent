import { Route } from '@angular/router';
import { ShellComponent } from './shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./listen/scan.page').then((m) => m.ScanPage),
      },
      {
        path: 'listen/:id',
        loadComponent: () =>
          import('./listen/listen.page').then((m) => m.ListenPage),
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./upload/upload.page').then((m) => m.UploadPage),
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];
