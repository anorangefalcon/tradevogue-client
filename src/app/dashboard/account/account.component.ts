import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from './api.service';
import { FormBuilder, FormGroup, Validators , AbstractControl, ValidationErrors} from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
 profileForm:any = FormGroup;
 form: any = FormGroup;
 postalCode: string = '';
 firstName: string = '';
 lastName: string = '';
  country: string = '';
  state: string = '';
  county: string = '';
  passwordVisible: boolean = false;
pincodeFilled: boolean = false;

validateNames(event: KeyboardEvent) {
  const input = event.key;
  const isNumber = /\d/.test(input);
  const isSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|"'-]/.test(input);

  if (isNumber || isSpecialCharacter) {
    event.preventDefault();
  }
}

get(dsfs: any) {
 console.log(dsfs);
}





  constructor(private postalCodeService: ApiService , private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
    // firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  this.form = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),  this.validateNames ]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50) , this.validateNames]],
    email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]],
     mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
     password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/),
        ],
      ],
  });
   }
   changee: boolean = true;

   

  onPostalCodeChange() {
    if (this.postalCode) {
      this.pincodeFilled = true;
      this.postalCodeService.getDetailsByPostalCode(this.postalCode)
        .subscribe((data: any[]) => {
          if (data.length > 0) {
            this.country = data[0].COUNTRY;
            this.state = data[0].STATE;
            this.county = data[0].COUNTY;
          } else {
            this.country = '';
            this.state = '';
            this.county = '';
          }
        });
    } else {
      this.pincodeFilled = false;
      this.country = '';
      this.state = '';
      this.county = '';
    }
  }

  
togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
}
}

