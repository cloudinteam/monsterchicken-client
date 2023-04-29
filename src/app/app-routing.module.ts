import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UriNotFoundComponent } from './web-pages/shared/uri-not-found/uri-not-found.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./web-pages/web-pages.module').then(m => m.WebPagesModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    component: UriNotFoundComponent
  },
  // {
  //   path: '',
  //   component: AppComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
