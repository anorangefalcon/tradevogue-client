import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from 'src/app/shared/services/popup.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { ToastService } from 'src/app/shared/services/toast.service';
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
  direction: string = 'right';
  show: boolean = false;
  currentTab: string = 'tab1'; // Set default tab
  title: string = "Monetization";
  popUpDirection: string = 'popup';
  showingPopUp: boolean = false;
  decrptedPublicKey: string = '';
  decryptedPrivateKey: string = '';
   passwordForm!: FormGroup;
   passwordMatchError: boolean = true;
  showTab(tab: string) {
    this.currentTab = tab;
  }

  ChangeHanlder(event: any) {
    this.show = event;
  }
  constructor(
    private formBuilder: FormBuilder,
    private loginCheckService: LoginCheckService,
    private util: UtilsModule,
    private fetch: FetchDataService,
    private http: HttpClient,
    private dialogService: DialogBoxService,
    private toastService: ToastService,
    private popup: PopupService) { }

  ngOnInit(): void {
    this.createForm();
    this.createRazorpayForm();
    this.fetchData();

    this.dialogService.responseEmitter.subscribe({
      next: (res: any) => {

        if (this.selectedItem && res && this.delete_type == ('stripe' || 'razorpay')) {
          const id = this.selectedItem._id;
          const itemIndex = this.paymentKeys.findIndex((key: any) => key._id === id);
          console.log(itemIndex, "item index are")
          if (itemIndex !== -1) {
            this.paymentKeys.splice(itemIndex, 1);
          }

          const body = {
            id
          }
          this.fetch.HTTPPOST(this.util.URLs.deletePaymentKeys, body)
            .subscribe((response: any) => {
              if(response) {
                this.toastService.successToast({ title: 'Payment Key Deleted Successfully' });
                this.fetchData();
              }
            })
        }
      }
    })

    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]] // You can set validation rules here
    });
  }

  fetchData() {
    this.fetch.HTTPGET(this.util.URLs.getAllPaymentKeys).subscribe((response: any) => {
      this.paymentKeys = response;
      this.razorpayPaymentKeys = response;
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
  this.selectedItem = key;
  console.log(this.selectedItem, "selected item are");
  
  if (this.selectedItem) {
    const id = this.selectedItem._id;
    const enable = !this.selectedItem.enable;
    const rzpIdKey = this.selectedItem.rzpIdKey;
    const rzpSecretKey = this.selectedItem.rzpSecretKey;
    
    const body = {
      id,
      enable,
      rzpIdKey,
      rzpSecretKey,
      toggle: true 
    };

    this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys, body).subscribe(
      (response: any) => {
        this.fetchData(); // Refresh data after successful update
      },
      (error: any) => {
        // Handle error if necessary
      }
    );
  }
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

view(key: any, index: any) {
  this.selectedItem = key;
  this.showingPopUp = true;
  console.log(this.selectedItem, index ,"selected item are");
  const urlWithParams = `${this.util.URLs.getDecrptedPaymentKeys}/${index}`;

  this.fetch.HTTPGET(urlWithParams).subscribe((response: any) => {
    this.decrptedPublicKey = response.decryptedPublicKey;
    this.decryptedPrivateKey = response.decryptedPrivateKey;
  });
}

onSubmitPassword(): void {
  if (this.passwordForm.valid) {
    const password = this.passwordForm.value.password;

    try {
      this.fetch.HTTPPOST(this.util.URLs.verifyPassword, { password }).subscribe(
        (res: any) => {
          if (res === 'okay') {
            this.passwordMatchError = false;
          } else if (res === 'password incorrect') {
            this.toastService.errorToast({ title: 'Password Not Matched' });
          }
        },
        (error: any) => {
          console.error('Error occurred while verifying password:', error);
        }
      );
    } catch (error) {
      this.toastService.errorToast({ title: 'Password Not Matched' });
      console.error('Error occurred:', error);
    }
  }
}

  PopUpChangeHanlder(event: boolean) {
    this.showingPopUp = event;
  }

 edit(key: any, index: any) {
  this.show = true;
  this.selectedItem = key;
  console.log(this.selectedItem, index ,"selected item are");

  const urlWithParams = `${this.util.URLs.getDecrptedPaymentKeys}/${index}`;

  this.fetch.HTTPGET(urlWithParams).subscribe((response: any) => {
    this.decrptedPublicKey = response.decryptedPublicKey;
    this.decryptedPrivateKey = response.decryptedPrivateKey;

    if (key) {
      this.selectedItem = key;
      this.editItem = true;
      this.stripeKeysForm.patchValue({
        publicKey: this.decrptedPublicKey,
        privateKey: this.decryptedPrivateKey,
        enableDropdown: this.selectedItem.enable ? 'true' : 'false',
      });
    }
  });
}


  togglePayment(key: any) {
    this.selectedItem = key;
    if (this.selectedItem) {
      const id = this.selectedItem._id;
      const enable = !this.selectedItem.enable;
      const publicKey = this.selectedItem.publicKey;
      const privateKey = this.selectedItem.privateKey;
      const toggle = !this.selectedItem.enable;
      const body = {
        id, enable , publicKey , privateKey , toggle
      }

      console.log(body, "body are")

      this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys, body).subscribe((response: any) => {
        this.fetchData();
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

      console.log(body, "body are")

      this.fetch.HTTPPOST(this.util.URLs.updatePaymentKeys, body)
        .subscribe((response: any) => {
          this.fetchData();
          this.stripeKeysForm.reset();
          this.show = false;
        })

      if (publicKey !== null && privateKey !== null && enable !== null) {
        this.selectedItem.publicKey = publicKey;
        this.selectedItem.privateKey = privateKey;
        this.selectedItem.enable = enable;
      }
    } else if (this.razorpayKeysForm.valid) {

    }
  }

  delete_type: string = 'stripe' || 'razorpay';

  delete(key: any) {
    this.selectedItem = key;
    this.delete_type = 'stripe' || 'razorpay';

    console.log(this.selectedItem, "selected item are");

    let template: any = {
      title: 'Proceed with Deletion?',
      subtitle: 'The key will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Delete it',
      cancelText: 'No, Keep it',
    };

    this.dialogService.confirmationDialogBox(template);
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
          this.fetchData();
          this.stripeKeysForm.reset();
        });
      });
    } else {
      const razorKeys = this.razorpayKeysForm.value;
      console.log(razorKeys, "razor keys are")
      this.loginCheckService.getUser('token').subscribe((data: any) => {
        const tokenSegments = data.split('.');
        const adminId = tokenSegments[1];

        const razorpayBody = {
          "rzpPublicKey": razorKeys.rzpPublicKey,
          "rzpPrivateKey": razorKeys.rzpPrivateKey,
          "adminId": adminId,
        };
        this.fetch.HTTPPOST(this.util.URLs.addPaymentKeys, razorpayBody).subscribe((response: any) => {
          // console.log(response, "response are")
          this.fetchData();
          this.razorpayKeysForm.reset();
        });
      })
    }
  }
}  