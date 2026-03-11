import { Injectable } from '@angular/core';
import { EndPointsService } from '../end-point.services';

@Injectable({
  providedIn: 'root'
})
export class DashboardEndpointService {
  getDetails: string = "";
  submitCustomerRequest: string = "";

  constructor(endpoint: EndPointsService) {
    //Basic URL
    let apiHostingURL = endpoint.apiHostingURL+ "api/Dashboard";
    
    this.getDetails = apiHostingURL + "/getDetails";
    this.submitCustomerRequest = apiHostingURL + "/submitCustomerRequest";
  }
}