import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCreationService } from '../../Service/QRCreationService/qr-creation-service';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';
import { QRCreationComponent } from './qr-creation';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [QRCreationComponent],
  imports: [
    MatIconModule,
    MatSnackBarModule ,
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    RouterModule.forChild([{ path: '', component: QRCreationComponent }])
  ],
  providers: [QRCreationService]
})
export class QRCreationComponentModule {}
