import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { SellerFetchDataService } from 'src/app/shared/services/seller-fetch-data.service';
import { DatePipe } from '@angular/common';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ToastService } from 'src/app/shared/services/toast.service';
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
  showPopup = true;
  area: string = '';
  userToken: any = '';
  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  password: string = "password";
  password2: string = "password";
  password3: string = "password";

  constructor(
    private postalCodeService: ApiService,
    private formBuilder: FormBuilder,
    private sellerFetchDataService: SellerFetchDataService,
    private datePipe: DatePipe,
    private userService: LoginCheckService,
    private fetchDataService : FetchDataService,
    private backendURLs : UtilsModule,
    private toastService: ToastService
  ) { }



  ngOnInit() {

    this.userService.getUser('token').subscribe((token: any) => {
      this.userToken = token;
    });

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
      area: ['', [Validators.required]],
    });


    var adminData = this.sellerFetchDataService.getSellerInfo().subscribe((data: any) => {
      // console.log("data", data)
      const formattedDob = this.datePipe.transform(data[0].info.dob, 'yyyy-MM-dd');
      this.profileForm.patchValue({
        firstName: data[0].name.firstname,
        lastName: data[0].name.lastname,
        email: data[0].email,
        dob: formattedDob,
        address: data[0].info.address[0].apartment,
        postalCode: data[0].info.address[0].pincode,
        country: data[0].info.address[0].country,
        state: data[0].info.address[0].state,
        city: data[0].info.address[0].city,
        gender: data[0].info.gender,
        mobile: data[0].mobile,
        area: data[0].info.address[0].area
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
            this.area = '';
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

          if(this.country) {
            this.profileForm.get('country')?.setValue(this.country);
            this.profileForm.get('state')?.setValue(this.state);
            this.profileForm.get('city')?.setValue(this.city);
            this.profileForm.get('area')?.setValue(this.county);
          }
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

  async updateDetails(form: { [key: string]: string }) {


    const body = {
      "email": form['email'],
      "name": {
        "firstname": form['firstName'],
        "lastname": form['lastName']
      },
      "mobile": form['mobile'],
      "info": {
        "gender": form['gender'],
        "dob": form['dob'],
        "address": [
          {
            "firstname": form['firstName'],
            "lastname": form['lastName'],
            "apartment": form['address'],
            "city": form['city'],
            "area": form['area'],
            "state": form['state'],
            "pincode": form['postalCode'],
            "country": form['country'],
          },
        ],
        "token": this.userToken
      }
    }

    // let data: any = await this.fetchDataService.httpPost(this.backendUrls.URLs.loginUrl, body);
    await this.sellerFetchDataService.sendSellerInfo(body);

    const pinData = {
      "POSTAL_CODE": form['postalCode'],
      "COUNTRY": form['country'],
      "STATE": form['state'],
      "COUNTY": form['city'],
      "CITY": form['county']
    }

    await this.sellerFetchDataService.sendPinInfo(pinData).subscribe((data: any) => {
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

  uploadImage(e: Event) {
    const file = (e.target as HTMLInputElement).files![0];
  }

  onResetPassword(){
    const body = {
      oldPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.changePassword, body).subscribe((data: any) => {
      console.log(data);
      
      this.toastService.successToast({ title: data.message })
      this.passwordForm.reset()
    });
  }
}
