import { Injectable } from '@angular/core';
import { EndPointsService } from '../end-point.services';

@Injectable({
  providedIn: 'root'
})
export class QrCreationEndpointService {
  getQRLink:string="";
  getDetails:string="";

  constructor(endpoint: EndPointsService) {
    //Basic URL
    let apiHostingURL = endpoint.apiHostingURL+ "api/QRCode";
    
    this.getDetails = apiHostingURL + "/getDetails";
    this.getQRLink = apiHostingURL + "/getQRLink";
  }
}