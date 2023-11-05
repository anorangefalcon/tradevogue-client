import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-monetization',
  templateUrl: './monetization.component.html',
  styleUrls: ['./monetization.component.css']
})
export class MonetizationComponent {
  stripeKeysForm!: FormGroup;
  paymentKeys: any[] = [];
  selectedItem: any;
  editItem: boolean = false;
  

  constructor(private formBuilder: FormBuilder, private util: UtilsModule, private fetch: FetchDataService, private cookie: CookieService, private http: HttpClient, private popup: PopupService) { }

  ngOnInit(): void {
    this.createForm();
    this.http.get<any[]>('http://localhost:1000/paymentKeys/getAll').subscribe((data) => {
      this.paymentKeys = data;
    });
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
        id , enable
      }

      this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys,body).subscribe((response: any) => {
        console.log('Keys updated successfully:', response);
      }
      ,(error: any) => {
        console.error('Error updating keys:', error);
      });
    }

  }

  onUpdate() {
    // console.log(this.selectedItem)
    if (this.selectedItem && this.stripeKeysForm) {
      const publicKey = this.stripeKeysForm.get('publicKey')?.value;
      const privateKey = this.stripeKeysForm.get('privateKey')?.value;
      const enable = this.stripeKeysForm.get('enableDropdown')?.value === 'true';
      const id = this.selectedItem._id;

      const body = {
        publicKey , privateKey , enable , id
      }

      this.fetch.httpPost(this.util.URLs.updatePaymentKeys,body)
        .then((response: any) => {
          console.log('Keys updated successfully:', response);
        })
        .catch((error: any) => {
          console.error('Error updating keys:', error);
        });

      if (publicKey !== null && privateKey !== null && enable !== null) {
        this.selectedItem.publicKey = publicKey;
        this.selectedItem.privateKey = privateKey;
        this.selectedItem.enable = enable;
      }
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

      this.fetch.httpPost(this.util.URLs.deletePaymentKeys,body)
        .then((response: any) => {
          console.log('Keys deleted successfully:', response);
        })
        .catch((error: any) => {
          console.error('Error deleting keys:', error);
        });
    }
  }
  
  

  onSubmit() {
    if (this.stripeKeysForm.valid) {
      const keys = this.stripeKeysForm.value;
      const tokenSegments = this.cookie.get('userToken').split('.');
      const adminId = tokenSegments[1];
      const body = {
        "publicKey": keys.publicKey,
        "privateKey": keys.privateKey,
        "adminId": adminId
      }

      console.log(adminId,"adminId")
      
      this.fetch.httpPost(this.util.URLs.addPaymentKeys,body)
        .then((response: any) => {
          console.log('Keys added successfully:', response);
        })
        .catch((error: any) => {
          console.error('Error adding keys:', error);
        });
    }
  }
}
