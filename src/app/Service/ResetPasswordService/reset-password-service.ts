import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/alert/alert.service';
import { ResetPasswordEndpointService } from './reset-password.end-point.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  constructor(private httpClient:HttpClient, private endpointService:ResetPasswordEndpointService,private alertService:AlertService) { }

  confirmResetPassword(payload:any): Observable<void>{
    return this.httpClient.post<any>(this.endpointService.confirmResetPassword, payload);
  }
}

