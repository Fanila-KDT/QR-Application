import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard";
import { AuthGuard } from "../../auth-guard";

export const routes: Routes = [
  {
    path: '', // ✅ empty path because it's already mounted at /dashboard
    component: DashboardComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
    data: { pageTitle: 'Dashboard' },
    children: []
  }
];

export const DashboardComponentRouting = RouterModule.forChild(routes);
