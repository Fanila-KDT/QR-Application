import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCreationService } from '../../Service/QRCreationService/qr-creation-service';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard';
import { RouterModule } from '@angular/router';
import { DashboardComponentRouting } from './dashboard.routing';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    MatIconModule,
    DashboardComponentRouting,
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }])
  ],
   exports: [DashboardComponent],
  providers:[QRCreationService]
})
export class DashboardComponentModule { }
