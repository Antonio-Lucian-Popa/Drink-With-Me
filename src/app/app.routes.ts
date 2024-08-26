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
  {
    path: 'map',
    loadChildren: () => import('./features/components/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./features/components/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./features/components/sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'user-profile/:id',
    loadChildren: () => import('./features/components/user-profile/user-profile.module').then(m => m.UserProfileModule)
  }
];
