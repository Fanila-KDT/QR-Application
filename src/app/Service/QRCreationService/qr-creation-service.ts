import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/alert/alert.service';
import { QrCreationEndpointService } from './qr-creation.end-point.service';
import { firstValueFrom, Observable } from 'rxjs';
import { QrModel } from '../../Model/QrModel/QrModel';

@Injectable({
  providedIn: 'root'
})
export class QRCreationService {
  tagNumber: string = '';
  constructor(private httpClient:HttpClient, private endpointService: QrCreationEndpointService,private alertService:AlertService) { }

   async generateQRCode(item_no:any): Promise<any> {
    try{
      const qr = await this.httpClient.get<any>(this.endpointService.getQRLink+'/'+ item_no).toPromise();
      return qr;
    }catch (error) {
      let message='Something went wrong while Generating QR Code';
      this.alertService.triggerAlert(message,4000, 'error');
    }
  }

  async getTagDetails(tagNo:any): Promise<QrModel[]> {
      try {
        const res = await firstValueFrom(
          this.httpClient.get<QrModel[]>(this.endpointService.getDetails+'/'+tagNo)
        );
        return res; // ✅ Return the response
      } catch (error) {
        console.error('getParametersList : ', error);
        const message = 'Something went wrong while Fetching Items. Please try again.';
        this.alertService.triggerAlert(message, 4000, 'error');
        return []; // Return empty array on error
      }
    }
}

