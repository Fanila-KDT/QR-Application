import { Component, signal } from '@angular/core';
import { LoginService } from './Service/LoginService/login-page-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('QRCreation');
  constructor(public loginService: LoginService){}

  async ngOnInit(){
    const res: any = await this.loginService.getTocken();
    localStorage.setItem('accessToken', res.accessToken);
  }
}
