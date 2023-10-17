import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { SellerFetchDataService } from 'src/app/shared/services/seller-fetch-data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  Check: boolean = false;
  changee: boolean = true;
  profileForm!: FormGroup;
  AccountForm!: FormGroup; 
  passwordForm!: FormGroup; 
  postalCode: string = '';
  country: string = '';
  state: string = '';
  county: string = '';
  city: string = '';
  passwordVisible: boolean = false;
  pincodeFilled: boolean = false;
  userPhoto: string = '';  
  private postalCodeInput = new Subject<string>();



  constructor(
    private postalCodeService: ApiService,
    private formBuilder: FormBuilder,
    private imageUpload: ImageUploadService,
    private backendURLs: UtilsModule,
    private sellerFetchDataService: SellerFetchDataService,
    private cookieService: CookieService
  ) {

   }


  ngOnInit() {
      // Use the patchValue method to update the profileForm with adminData
  

    this.profileForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateNames,
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateNames,
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
          ),
        ],
      ],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      mobile: [
        '',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/),
        ],
      ],
      address: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });


    var adminData = this.sellerFetchDataService.getSellerInfo().subscribe((data: any) => {
      console.log(data, "data is coming");
      this.profileForm.patchValue({
        firstName: data[0].name.firstname,
        lastName: data[0].name.lastname,
        email: data[0].email,
        dob: data[0].info.dob,
        address: data[0].info.address[0].apartment,
        postalCode: data[0].info.address[0].pincode,
        country: data[0].info.address[0].country,
        state: data[0].info.address[0].state,
        city: data[0].info.address[0].city,
        gender: data[0].info.gender,
        mobile: data[0].mobile,
      });
    });

    this.AccountForm = this.formBuilder.group({
      // Create a FormGroup for AccountForm
      BankName: ['', Validators.required],
      AccountHolder: ['', Validators.required],
      AccountNo: ['', [Validators.required, Validators.maxLength(17), Validators.minLength(5)]],
      IFSC: ['', [Validators.required, Validators.maxLength(11)]],
      GST: ['', [Validators.required, Validators.maxLength(15)]],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    })



    this.postalCodeInput
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (value) {
            this.pincodeFilled = true;
            return this.postalCodeService.getDetailsByPostalCode(value);
          } else {
            this.pincodeFilled = false;
            this.country = '';
            this.state = '';
            this.county = '';
            this.city = '';
            return [];
          }
        })
      )
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.country = data[0].COUNTRY;
          this.state = data[0].STATE;
          this.county = data[0].COUNTY;
          this.city = data[0].CITY;
        } else {
          this.country = '';
          this.state = '';
          this.county = '';
          this.city = '';
        }
      });


      this.AccountForm.disable();
      this.profileForm.disable();
  }

  onPostalCodeInputChange() {
    const postalCodeValue = this.profileForm?.get('postalCode')?.value;
    this.postalCodeInput.next(postalCodeValue);
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  validateNames(event: KeyboardEvent) {
    const input = event.key;
    const isNumber = /\d/.test(input);
    const isSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(input);

    if (isNumber || isSpecialCharacter) {
      event.preventDefault();
    }
  }

  async updateDetails(form: {[key: string]: string}) {
    console.log(form, "form is coming");
    const body = {
      "email": form['email'],
      "name": {
        "firstname": form['firstName'],
        "lastname": form['lastName']
      },
      "mobile" : form['mobile'],
      "info":{
        "gender": form['gender'],
        "dob": form['dob'],
        "address": [
          {
              "firstname": form['firstName'],
              "lastname": form['lastName'],
              "apartment": form['address'],
              "city": form['city'],
              "area": form['county'],
              "state": form['state'],
              "pincode": form['postalCode'],
              "country": form['country'],
          },
      ],
      "token": this.cookieService.get('userToken')
      }
    }
    
    // let data: any = await this.fetchDataService.httpPost(this.backendUrls.URLs.loginUrl, body);
    await this.sellerFetchDataService.sendSellerInfo(body);

    const pinData= {
      "POSTAL_CODE": form['postalCode'],
      "COUNTRY": form['country'],
      "STATE": form['state'],
      "COUNTY": form['city'],
      "CITY": form['county']
    }

    await this.sellerFetchDataService.sendPinInfo(pinData).subscribe((data: any) => {
      console.log(data, "pincode data is coming");
    });
  }

  
  
  

  // async saveDetails() {

  //   this.DetailsSubmitted = true;
  //   if (this.ProfileForm.invalid) return;

  //   let body = {
  //     name: { firstname: this.ProfileForm.get('firstname')?.value, lastname: this.ProfileForm.get('lastname')?.value },
  //     email: this.ProfileForm.get('email')?.value,
  //     mobile: this.ProfileForm.get('mobile')?.value,
  //     "info.gender": this.ProfileForm.get('gender')?.value,
  //     "info.dob": new Date(this.ProfileForm.get('dob')?.value)
  //   }
  //   let response = await this.fetchDataService.httpPost(this.backendURLs.URLs.updateDetails, body);
  //   this.isReadOnly = !this.isReadOnly;
  // }

  uploadImage(e: Event){
    const file = (e.target as HTMLInputElement).files![0];
  }
}
