import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/alert/alert.service';
import { Login } from '../../Model/LoginModel/Login';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { LoginEndpointService } from './login-page.end-point.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  username: string = '';
  constructor(private httpClient:HttpClient, private endpointService: LoginEndpointService,private alertService:AlertService) { }

  async checkLoginCredinals(loginData: Login): Promise<any> {
    try {
      const params = new HttpParams()
        .set('password', loginData.password)
        .set('user_id', loginData.user_id);

      const res = await firstValueFrom(
        this.httpClient.get<any>(this.endpointService.checkLoginCredinals, { params })
      );
      return res;
    } catch (error) {
      console.error('CheckLoginCredinals error:', error);
      this.alertService.triggerAlert('Login failed. Please try again.', 4000, 'error');
      return null;
    }
  }

  async checkTagCustomer(creditcustomerid: any,tagNumber:any): Promise<any> { 
    try {
        const params = new HttpParams()
          .set('creditcustomerid', creditcustomerid)
          .set('tagNumber', tagNumber);

        const res = await firstValueFrom(
          this.httpClient.get<any>(this.endpointService.checkTagCustomer, { params })
        );
        return res;
      } catch (error) {
        console.error('checkTagCustomer error:', error);
        this.alertService.triggerAlert('Login failed. Please try again.', 4000, 'error');
        return null;
      }
    }

  async checkEmailExists(email:any): Promise<any> {
    try{
      const emailres = await this.httpClient.get<any>(this.endpointService.checkemail+'/'+ email).toPromise();
      return emailres;
    }catch (error) {
      console.error('checkEmailExists : ', error);
    }
  }

  async SaveSignUpData(login: Login): Promise<string | undefined | null> {
    try {
      const res = await this.httpClient.post(
        this.endpointService.SaveSignUpData,
        login,
        { responseType: 'text' } // 👈 This is the key fix
      ).toPromise();

      return res;
    } catch (error) {
      console.error('SaveSignUpData : ', error);
      const message = 'Something went wrong while Saving... Please try again.';
      this.alertService.triggerAlert(message, 4000, 'error');
      return null;
    }
  }

  requestPasswordReset(email: string): Observable<void> {
    const url = this.endpointService.requestPasswordReset;
    return this.httpClient.post<void>(url, { email });
  }

    async GetCustomerList(): Promise<any[]> {
    const message = 'Something went wrong while fetching Customer List. Please try again.';
    try {
      return await lastValueFrom(
        this.httpClient.get<any[]>(this.endpointService.getCustomerList)
      );
    } catch (error) {
      console.error('GetproductClassList:', error);
      this.alertService.triggerAlert(message, 4000, 'error');
      throw error; // rethrow so component can handle it
    }
  }

}
