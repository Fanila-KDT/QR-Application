import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../Service/ResetPasswordService/reset-password-service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  token: string | null = null;
  password: any;
  confirmPassword: any;
  message: any;
  errmessage: any;
  tagnumber: string | null = null;
  resetbtn: boolean =false;

  constructor(private route: ActivatedRoute,private router: Router,private resetService: ResetPasswordService) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.route.queryParamMap.subscribe(params => {
      this.tagnumber = this.route.snapshot.queryParamMap.get('tagNumber');
    }); 
  }

  resetPassword(): void {

    if (this.password !== this.confirmPassword) {
      this.errmessage = 'Passwords do not match!';
      return;
    } 
    this.errmessage = '';
    const payload = {
      token: this.token,
      newPassword: this.password
    };

    this.resetService.confirmResetPassword(payload).subscribe({
      next: () => {
        this.message = 'Password reset successful. You can now log in with your new password.'
        this.resetbtn =true;
      },
      error: () => this.errmessage = 'Invalid or expired token.'
    });
  }

}
