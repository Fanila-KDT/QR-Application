import { Injectable } from '@angular/core';
import { EndPointsService } from '../end-point.services';

@Injectable({
  providedIn: 'root'
})
export class LoginEndpointService {
  checkLoginCredinals: string;
  checkemail: string;
  SaveSignUpData: string = '';
  requestPasswordReset: string = '';
  getCustomerList: string = '';
  checkTagCustomer: string = '';
  GetTocken: string;
  
  constructor(endpoint: EndPointsService) {
    //Basic URL
    let apiHostingURL = endpoint.apiHostingURL+ "api/Login";
    
    this.checkLoginCredinals = apiHostingURL + "/CheckLoginCredinals";
    this.checkemail = apiHostingURL + "/checkemail";
    this.SaveSignUpData = apiHostingURL + "/saveSignUpData";
    this.requestPasswordReset = apiHostingURL + "/requestPasswordReset";
    this.getCustomerList = apiHostingURL + "/getCustomerList";
    this.checkTagCustomer = apiHostingURL + "/checkTagCustomer";
    this.GetTocken = apiHostingURL + "/getTocken";
  }
}