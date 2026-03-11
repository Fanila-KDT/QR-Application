import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';

// Import your components

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full'
  },
  {
    path: 'login-page',
    loadChildren: () =>
      import('./Forms/login-page/login-page.module').then(m => m.LoginComponentModule)
  },
  {
    path: 'qr-creation',
    loadChildren: () =>
      import('./Forms/qr-creation/qr-creation.module').then(m => m.QRCreationComponentModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./Forms/dashboard/dashboard.module').then(m => m.DashboardComponentModule), canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./Forms/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

  