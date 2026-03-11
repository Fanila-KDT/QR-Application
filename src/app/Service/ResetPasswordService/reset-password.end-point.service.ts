import { Injectable } from '@angular/core';
import { EndPointsService } from '../end-point.services';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordEndpointService {
  confirmResetPassword:string="";

  constructor(endpoint: EndPointsService) {
    //Basic URL
    let apiHostingURL = endpoint.apiHostingURL+ "api/Login";

    this.confirmResetPassword = apiHostingURL + "/confirmResetPassword";
  }
}