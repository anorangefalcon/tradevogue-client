import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  Check: boolean = false;
  changee: boolean = true;
  profileForm!: FormGroup;
  AccountForm!: FormGroup; // Define AccountForm as a FormGroup
  postalCode: string = '';
  country: string = '';
  state: string = '';
  county: string = '';
  passwordVisible: boolean = false;
  pincodeFilled: boolean = false;
  userPhoto: string = '';  
  private postalCodeInput = new Subject<string>();



  constructor(
    private postalCodeService: ApiService,
    private formBuilder: FormBuilder,
    private imageUpload: ImageUploadService 
  ) { }


  ngOnInit() {
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
      organization: [''],
      address: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')],
      ],
    });

    this.AccountForm = this.formBuilder.group({
      // Create a FormGroup for AccountForm
      BankName: ['', Validators.required],
      AccountHolder: ['', Validators.required],
      AccountNo: ['', [Validators.required, Validators.maxLength(17), Validators.minLength(5)]],
      IFSC: ['', [Validators.required, Validators.maxLength(11)]],
      GST: ['', [Validators.required, Validators.maxLength(15)]],
    });



    this.postalCodeInput
      .pipe(
        debounceTime(300),
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
            return [];
          }
        })
      )
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

  updateInformation() {

  }

  uploadImage(e: Event){
    const file = (e.target as HTMLInputElement).files![0];
  }
}
