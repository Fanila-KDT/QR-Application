import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Login } from '../../Model/LoginModel/Login';
import { LoginService } from '../../Service/LoginService/login-page-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../shared/alert/alert.service';
import { AuthService } from '../../auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptionService } from '../../Service/encryption';

@Component({
  selector: 'login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginComponent {
  CustomerList: any[] = [];
  login: Login = new Login();
  loginSignUp: Login = new Login();
  isUserIdInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  showSignupModal: boolean = false;
  showFrgtPassModal: boolean = false;
  errorMessage: string = '';
  errorMessageSignUp: string = '';
  errorMessageFP: string = '';
  isSignupNameInvalid: boolean = false;
  isSignupUserIdInvalid: boolean = false;
  isSignupPasswordInvalid: boolean = false;
  isCustomerNameInvalid: boolean = false;
  tagNumber: string | null = null;
  encryptedTag: string | null = null;
  message: string = '';
  forgotForm: FormGroup;
  submitted = false;
  showPassword = false;
  status: any;

  constructor(public encryptionService:EncryptionService, private fb: FormBuilder,private authService: AuthService,private route: ActivatedRoute, public loginService: LoginService,private router: Router,private ngZone: NgZone,private alertService:AlertService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.encryptedTag =  params.get('tag');
    });
    this.CustomerList = await this.loginService.GetCustomerList();
  }

  // async onSubmit(LoginForm: any) {
  //   const isValid = await this.validateForm(this.login);
  //   if (!isValid) {
  //     this.errorMessage = 'Pleease fill in all required fields correctly';
  //     return;
  //   }
  //   this.loginService.checkLoginCredinals(this.login).then((res: any) => {
  //    localStorage.setItem('username', res.username);
  //    localStorage.setItem('user_id', this.login.user_id);

  //     if (res.message !== 'Valid') {
  //       this.errorMessage = 'Invalid User ID or Password';
  //       return;
  //     }
  //     if (res.inactive) {
  //       this.errorMessage = 'Your account is inactive. Please contact support';
  //       return;
  //     }

  //     // 🔑 Wait for tag check before continuing
  //     if (this.encryptedTag) {
  //       const tagNumber = this.encryptionService.decryptTag(this.encryptedTag);
  //       const result: any = await this.loginService.checkTagCustomer(res.creditcustomerid, tagNumber);
  //       this.status = result?.message;

  //       if (this.status !== 'Valid') {
  //         this.errorMessage = 'xxxxxxxxxxxxxxxxxxxxxxx';
  //         return;
  //       }
  //     }

  //     this.errorMessage = '';
  //     if(res.userType === 'Employee'){
  //       this.ngZone.run(() => {
  //         this.router.navigate(['/qr-creation']);
  //       });
  //     } 
  //     else if(res.userType === 'Customer'){
  //       if(!this.encryptedTag) {
  //         this.errorMessage = 'Unauthorized access. Please contact Administrator';
  //         return;
  //       }
  //       this.authService.login('valid');
  //       this.ngZone.run(() => {
  //         this.router.navigate(['/dashboard'], { queryParams: { tagNumber: this.encryptedTag } });
  //       });
  //     }
  //     else{
  //       this.errorMessage = 'Unknown User type';
  //     }
  //   }).catch(error => {
  //     console.error('Something went wrong:', error);
  //   });
  // }

  async onSubmit(LoginForm: any) {
    const isValid = await this.validateForm(this.login);
    if (!isValid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    try {
      const res: any = await this.loginService.checkLoginCredinals(this.login);

      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('username', res.username);
      localStorage.setItem('user_id', this.login.user_id);

      if (res.message !== 'Valid') {
        this.errorMessage = 'Invalid User ID or Password';
        return;
      }

      if (res.inactive) {
        this.errorMessage = 'Your account is inactive. Please contact support';
        return;
      }

      this.errorMessage = '';

      if (res.userType === 'Employee') {
        this.showSignupModal = false;
        this.ngZone.run(() => {
          this.router.navigate(['/qr-creation']);
        });
      } 
      else if (res.userType === 'Customer') {
        this.showSignupModal = false;
        if (this.encryptedTag) {
          const tagNumber = this.encryptionService.decryptTag(this.encryptedTag);
          const result: any = await this.loginService.checkTagCustomer(res.creditcustomerid, tagNumber);
          this.status = result?.message;

          if (this.status !== 'Valid') {
            this.errorMessage = 'Entry Prohibited: Machine not linked to your Customer ID';
            return;
          }
        }
        if (!this.encryptedTag) {
          this.errorMessage = 'Unauthorized access. Please contact Administrator';
          return;
        }
        this.authService.login('valid');
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard'], { queryParams: { tagNumber: this.encryptedTag } });
        });
      } else {
        this.showSignupModal = true;
      }
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }

  async validateForm(model: Login): Promise<boolean> {
    this.isUserIdInvalid = !model.user_id?.trim();
    this.isPasswordInvalid = !model.password?.trim();
    const isValid = !(
      this.isUserIdInvalid ||
      this.isPasswordInvalid 
    );
    return isValid;
  }

  cancelSignUp() {
    this.showSignupModal = false;
    this.loginSignUp.user_id='';
    this.loginSignUp.user_name=''; 
    this.loginSignUp.password='';
    this.loginSignUp.creditcustomerid='';
    this.loginSignUp.user_type='Employee';
    this.isSignupNameInvalid = false;
    this.isSignupUserIdInvalid = false;
    this.isSignupPasswordInvalid = false;
    this.isCustomerNameInvalid = false;
    this.errorMessageSignUp = '';
  }
  cancelFPass() {
    this.errorMessageFP = '';
    this.showFrgtPassModal = false;
    this.forgotForm.reset();
    this.submitted = false;
    this.message = '';
  }

  navigateToForgot() {
    this.showFrgtPassModal = true;
  }
  
  // navigateToSignup() {
  //   this.showSignupModal = true;
  // }

  async onSignup() {
    const isValid = await this.validateFormSignUp(this.loginSignUp);
    if (!isValid) {
      this.errorMessageSignUp = 'Please fill all mandatory fields.';
      return;
    }
    var response = await this.loginService.checkEmailExists(this.loginSignUp.user_id);
    if (response) {
      this.errorMessageSignUp = 'Username is already registered.';
      return;
    }
    var isEmailValid = this.isValidEmail(this.loginSignUp.user_id || '');
    if (!isEmailValid) {
      this.errorMessageSignUp = 'Please enter a valid email address.';
      return;
    }
    

    this.loginService.SaveSignUpData(this.loginSignUp).then((res: string | null | undefined) => {
    if (res) {
      this.cancelSignUp();
      this.alertService.triggerAlert(res, 4000, 'success');
    }
    }).catch(error => {
      console.error('SaveSignUpData error:', error);
    });
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 async validateFormSignUp(model: Login): Promise<boolean> {
    this.isSignupNameInvalid = !model.user_name?.trim();
    this.isSignupUserIdInvalid = !model.user_id?.trim();
    this.isSignupPasswordInvalid = !model.password?.trim();

    // Only validate Customer Name if user_type is "Customer"
    if (model.user_type === 'Customer') {
      this.isCustomerNameInvalid = !model.creditcustomerid?.toString()?.trim();
    } else {
      this.isCustomerNameInvalid = false; // not mandatory for Employee
    }
    const isValid = !(
      this.isSignupUserIdInvalid ||
      this.isSignupNameInvalid ||
      this.isSignupPasswordInvalid ||
      this.isCustomerNameInvalid
    );
    return isValid;
  }

  onForgtPass(){
    this.submitted = true;
    if(!this.forgotForm.value.email){
      this.errorMessageFP = 'Please enter your email address.';
      return;
    }
    if (!this.forgotForm.valid) {
      this.errorMessageFP = 'Please enter a valid email address.';
      return;
    }

    this.loginService.requestPasswordReset(this.forgotForm.value.email)
    .subscribe({
      next: () => this.message = 'If your email exists, a reset link has been sent.',
      error: () => this.message = 'Something went wrong. Please try again.'
    });
  }
}
