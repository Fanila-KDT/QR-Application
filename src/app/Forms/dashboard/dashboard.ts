import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerRequest, Dashboard } from '../../Model/DashboardModel/Dashboard';
import { DashboardService } from '../../Service/DashboardService/dashboard-service';
import { AlertService } from '../../shared/alert/alert.service';
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from '../../Service/encryption';
import { LoginService } from '../../Service/LoginService/login-page-service';
import { AuthService } from '../../auth';

@Component({
  selector: 'dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  tagNumber: string | null = null;
  dashboard: Dashboard = new Dashboard();
  customerRequest: CustomerRequest = new CustomerRequest();
  user: any;
  SubmitDisable: boolean = false;


  constructor(private route: ActivatedRoute,public dashboardService:DashboardService,private router: Router, private alertService: AlertService,public encryptionService:EncryptionService) {
  }

  ngOnInit(): void {
    this.user = localStorage.getItem('username');
    this.route.queryParamMap.subscribe(params => {
      const encryptedTag = this.route.snapshot.queryParamMap.get('tagNumber');
      if (encryptedTag) {
        try {
          this.tagNumber = this.encryptionService.decryptTag(encryptedTag);
          this.dashboardService.getParametersList(this.tagNumber).then(data => {
            this.dashboard = data[0];
          });
        } catch (err) {
          console.error('Decryption failed:', err);
          this.tagNumber = null;
        }
      }
    });
  }

  logOut() {
    this.router.navigate(['/login-page']);
  } 

  submitRequest() {
    this.buildRequestType();
    if(!this.customerRequest.request_type || !this.customerRequest.mobile_no || !this.customerRequest.contact_person) {
      this.alertService.triggerAlert('Please fill the required Fields...', 4000, 'error');
      return;
    }
    this.customerRequest.tag_id = this.dashboard.tag_id;
    this.customerRequest.user_id = localStorage.getItem('user_id');
    this.dashboardService.submitCustomerRequest(this.customerRequest).then(response => {
      if(response){
        this.alertService.triggerAlert('Request submitted successfully...', 4000, 'success');
        this.SubmitDisable = true;
      }
    }).catch(error => {
      console.error('Error submitting request:', error);
      this.alertService.triggerAlert('Failed to submit request. Please try again...', 4000, 'error');
    });
  }

  buildRequestType() {
    const selected: string[] = [];
    if (this.customerRequest.Repair) {
      selected.push('Repair Request');
    }
    if (this.customerRequest.Refill) {
      selected.push('Ink Refill');
    }
    if (this.customerRequest.Other) {
      selected.push('Other Complaints');
    }
    this.customerRequest.request_type = selected.join(', ');
  }
}

