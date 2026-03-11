import { Component } from '@angular/core';
import * as QRCode from 'qrcode';
import {  QRCreationService } from '../../Service/QRCreationService/qr-creation-service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../shared/alert/alert.service';
import { QrModel } from '../../Model/QrModel/QrModel';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'qr-creation',
  templateUrl: './qr-creation.html',
  standalone: false,
  styleUrl: './qr-creation.css',
  providers: [DatePipe]
})
export class QRCreationComponent {
  qrCodeBase64: string | null = null;
  qrContent: string | null = null;
  qrCodeBase64Gov: string | null = null;
  qrContentGov: string | null = null;
  tagDetails: string = ''; // Replace with actual model
  tagMaster: QrModel = new QrModel();
  errorMessage: string = '';
  ContractNo : string = '';
  warranty_startdate : string = '';
  warranty_enddate : string = '';
  user:any;

  constructor(private notificationService: NotificationService,public qrCreationService: QRCreationService,private alertService:AlertService,private router: Router,private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('username');
    // Subscribe to notifications
    // this.notificationService.notifications$.subscribe(data => {
    //   this.alertService.triggerAlert(`New complaint raise by user ${data.contactPerson } for (${data.requestType})`, 4000, 'info');
    // });
  }

  async generateQRCode() {
    if(!this.tagMaster.tag_no) {
      this.errorMessage='Please enter Tag No to Generate QR Code';
      this.qrCodeBase64 = null;
      return;
    }

    await this.qrCreationService.getTagDetails(this.tagMaster.tag_no).then(data => {
      if(data.length != 0) {
        this.tagMaster = data[0];
        this.errorMessage='';
      } else {
        this.tagMaster = new QrModel();
        this.errorMessage='Please enter valid Tag No to Generate QR Code';
        return;
      }
    });

    if(this.errorMessage == ''){
      let response = await this.qrCreationService.generateQRCode(this.tagMaster.tag_no);
      this.qrCreationService.tagNumber = this.tagMaster.tag_no;
      if(this.tagMaster.cust_type == 'GOVT'){
        this.ContractNo = this.tagMaster.contract_no || '';
        this.warranty_startdate = this.tagMaster.warranty_startdate ? this.datePipe.transform(this.tagMaster.warranty_startdate, 'dd/MM/yyyy') || '' : '';
        this.warranty_enddate = this.tagMaster.warranty_enddate ? this.datePipe.transform(this.tagMaster.warranty_enddate, 'dd/MM/yyyy') || '' : '';
        this.qrCodeBase64Gov = response?.qrCodeBase64 || null;
        this.qrContentGov = response?.qrContent || null;
      }else{
        this.qrCodeBase64 = response?.qrCodeBase64 || null;
        this.qrContent = response?.qrContent || null;
      }   
    }
  }

  searchTagDetails() {
    if(!this.tagMaster.tag_no) {
      this.errorMessage='Please enter Tag No to Search';
      return;
    }
     this.errorMessage='';
    this.qrCreationService.getTagDetails(this.tagMaster.tag_no).then(data => {
      if(data.length != 0) {
        this.tagMaster = data[0];
      } else {
        this.tagMaster = new QrModel();
        this.errorMessage='No Tag Details Found';
        return;
      }
    });
  }

  logOut() {
     this.router.navigate(['/login-page']);
  } 

  downloadPoster() {
    const posterElement = document.getElementById('poster');
    if (!posterElement) return;

    html2canvas(posterElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `KDT-${this.tagMaster.tag_no}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  downloadPosterGovt() {
    const posterElement = document.getElementById('posterGovt');
    if (!posterElement) return;
    html2canvas(posterElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `KDT-${this.tagMaster.tag_no}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

}
