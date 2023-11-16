import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';

@Component({
  selector: 'app-monetization',
  templateUrl: './monetization.component.html',
  styleUrls: ['./monetization.component.css']
})
export class MonetizationComponent {
  stripeKeysForm!: FormGroup;
  razorpayKeysForm!: FormGroup;
  paymentKeys: any[] = [];
  razorpayPaymentKeys: any[] = []
  selectedItem: any;
  editItem: boolean = false;


  constructor(private formBuilder: FormBuilder, private loginCheckService: LoginCheckService, private util: UtilsModule, private fetch: FetchDataService, private cookie: CookieService, private http: HttpClient, private popup: PopupService) { }

  ngOnInit(): void {
    this.createForm();
    this.createRazorpayForm();
    this.http.get<any[]>('http://localhost:1000/paymentKeys/getAll').subscribe((data) => {
      this.paymentKeys = data;
      this.razorpayPaymentKeys = data;
    });
  }

  createRazorpayForm(): void {
    this.razorpayKeysForm = this.formBuilder.group({
      rzpPublicKey: ['', [Validators.required]],
      rzpPrivateKey: ['', [Validators.required]],
      rzpEnableDropdown: ['true'],
    });
  }
  toggleRazorpayPayment(key: any) {

  }

  viewRazorpay(key: any) {

  }

  editRazorpay(key: any) {

  }

  deleteRazorpay(key: any) { }

  onRazorpaySubmit() {

  }



  createForm(): void {
    this.stripeKeysForm = this.formBuilder.group({
      publicKey: ['', [Validators.required]],
      privateKey: ['', [Validators.required]],
      enableDropdown: ['true'],
    });

  }

  view(key: any) {
    this.selectedItem = key;
    this.popup.openPopup();
  }

  edit(key: any) {
    this.selectedItem = key;
    if (key) {
      this.selectedItem = key;
      this.editItem = true;
      this.stripeKeysForm.patchValue({
        publicKey: this.selectedItem.publicKey,
        privateKey: this.selectedItem.privateKey,
        enableDropdown: this.selectedItem.enable ? 'true' : 'false',
      });
    }
  }

  togglePayment(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const enable = !this.selectedItem.enable;
      const body = {
        id, enable
      }

      this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys, body).subscribe((response: any) => {
      
      }
        , (error: any) => {
         
        });
    }

  }

  onUpdate() {
    if (this.selectedItem && this.stripeKeysForm) {
      const publicKey = this.stripeKeysForm.get('publicKey')?.value;
      const privateKey = this.stripeKeysForm.get('privateKey')?.value;
      const enable = this.stripeKeysForm.get('enableDropdown')?.value === 'true';
      const id = this.selectedItem._id;

      const body = {
        publicKey, privateKey, enable, id
      }

      this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys, body)
        .subscribe((response: any) => {
        })

      if (publicKey !== null && privateKey !== null && enable !== null) {
        this.selectedItem.publicKey = publicKey;
        this.selectedItem.privateKey = privateKey;
        this.selectedItem.enable = enable;
      }
    } else if (this.razorpayKeysForm.valid) {

    }
  }

  delete(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const itemIndex = this.paymentKeys.findIndex((key: any) => key._id === id);
      if (itemIndex !== -1) {
        this.paymentKeys.splice(itemIndex, 1);
      }

      const body = {
        id
      }

      this.fetch.HTTPPOST(this.util.URLs.deletePaymentKeys, body)
        .subscribe((response: any) => {
        })

    }
  }



  onSubmit() {
    if (this.stripeKeysForm.valid) {
      const keys = this.stripeKeysForm.value;
      this.loginCheckService.getUser('token').subscribe((data: any) => {
        const tokenSegments = data.split('.');
        const adminId = tokenSegments[1];
        const body = {
          "publicKey": keys.publicKey,
          "privateKey": keys.privateKey,
          "adminId": adminId
        }

        this.fetch.HTTPPOST(this.util.URLs.addPaymentKeys, body).subscribe((response: any) => {
        });
      });
    } else if (this.razorpayKeysForm.valid) {
      const razorKeys = this.razorpayKeysForm.value;
      this.loginCheckService.getUser('token').subscribe((data: any) => {
        const tokenSegments = data.split('.');
        const adminId = tokenSegments[1];

        const razorpayBody = {
          "rzpPublicKey": razorKeys.rzpPublicKey,
          "rzpPrivateKey": razorKeys.rzpPrivateKey,
          "adminId": adminId,
        };
        this.fetch.HTTPPOST(this.util.URLs.addPaymentKeys, razorpayBody).subscribe((response: any) => {
        });
      })
    }
  }
}  
