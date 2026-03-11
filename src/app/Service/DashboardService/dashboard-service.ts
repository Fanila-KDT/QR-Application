import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/alert/alert.service';
import { CustomerRequest, Dashboard } from '../../Model/DashboardModel/Dashboard';
import { firstValueFrom } from 'rxjs';
import { DashboardEndpointService } from './dashboard.end-point.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient:HttpClient, private endpointService: DashboardEndpointService,private alertService:AlertService) {}

  async getParametersList(itemNo:any): Promise<Dashboard[]> {
    try {
      const res = await firstValueFrom(
        this.httpClient.get<Dashboard[]>(this.endpointService.getDetails+'/'+itemNo)
      );
      return res; // ✅ Return the response
    } catch (error) {
      console.error('getParametersList : ', error);
      const message = 'Something went wrong while Fetching Items. Please try again.';
      this.alertService.triggerAlert(message, 4000, 'error');
      return []; // Return empty array on error
    }
  }

  async submitCustomerRequest(customerRequest: CustomerRequest): Promise<string | undefined | null> {
    try {
      const res = await this.httpClient.post(
        this.endpointService.submitCustomerRequest,
        customerRequest,
        { responseType: 'text' } // 👈 This is the key fix
      ).toPromise();

      return res;
    } catch (error) {
      console.error('submitCustomerRequest : ', error);
      const message = 'Something went wrong while Saving... Please try again.';
      this.alertService.triggerAlert(message, 4000, 'error');
      return null;
    }
  }
}
