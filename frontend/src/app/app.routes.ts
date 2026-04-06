import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'library', pathMatch: 'full' },
      { path: 'children', loadComponent: () => import('./pages/children/children.component').then(m => m.ChildrenComponent) },
      { path: 'new-story', loadComponent: () => import('./pages/new-story/new-story.component').then(m => m.NewStoryComponent) },
      { path: 'story/:id', loadComponent: () => import('./pages/story-reader/story-reader.component').then(m => m.StoryReaderComponent) },
      { path: 'library', loadComponent: () => import('./pages/library/library.component').then(m => m.LibraryComponent) },
      { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent) },
      { path: 'dream-universe', loadComponent: () => import('./pages/dream-universe/dream-universe.component').then(m => m.DreamUniverseComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'subscribe', loadComponent: () => import('./pages/subscribe/subscribe.component').then(m => m.SubscribeComponent) },
    ]
  },
  { path: '**', redirectTo: '' },
];
