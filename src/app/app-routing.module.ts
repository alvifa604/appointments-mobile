import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard.guard';

const routes: Routes = [
  {
    path: 'session',
    loadChildren: () =>
      import('./session/session.module').then((m) => m.SessionModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'session',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
})
export class AppRoutingModule {}
