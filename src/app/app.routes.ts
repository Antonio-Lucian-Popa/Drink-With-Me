import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  {
    path: 'feed',
    loadChildren: () => import('./shared/components/feed/feed.module').then(m => m.FeedModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/components/settings/settings.module').then(m => m.SettingsModule)
  },
];
