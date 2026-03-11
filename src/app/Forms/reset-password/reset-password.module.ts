import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ResetPassword } from './reset-password';
import { ResetPasswordService } from '../../Service/ResetPasswordService/reset-password-service';


@NgModule({
  declarations: [ResetPassword],
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    RouterModule.forChild([{ path: '', component: ResetPassword }])
  ],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule {}
