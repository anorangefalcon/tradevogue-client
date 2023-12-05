import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/dashboard/services/api.service';

// import {}
import { PhoneNumberValidator } from '../../auth/validators';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { min } from 'lodash';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {

  direction: string = 'right';
  show: boolean = false;
  title!:string;
  @Input() receiveData: any;
  @Input() ShowComponent: any;
  @Output() AddressHandler: EventEmitter<any> = new EventEmitter();
  DetailsForm: FormGroup;
  
  // pincode
  // states: any[] = ['Punjab', 'Delhi', 'UP'];
  states: any;
  town_city: any;
  country: any;
  area: any = [];

  // pincode
  pincodeFilled: boolean = false;
  private postalCodeInput = new Subject<string>();

  constructor(private fetchService: FetchDataService, private backendURLs: UtilsModule, private fb: FormBuilder, private postalCodeService: ApiService) {
    this.DetailsForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        apartment: fb.control('', [Validators.required]),
        area: fb.control('', [Validators.required]),
        landmark: fb.control('', [Validators.required,]),
        pincode: fb.control('', [Validators.required,]),
        town_city: fb.control('', [Validators.required,]),
        state: fb.control('', [Validators.required,]),
        mobile: ['', [Validators.required,this.PhoneNoValidator,]],
      });
  }

  // pincode
  ngOnInit(): void {
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
            // this.country = '';
            this.states = '';
            this.town_city = '';
            // this.city = '';
            this.area = [];
            return [];
          }
        })
      )
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.country = data[0].COUNTRY;
          this.states = data[0].STATE;
          this.town_city = data[0].COUNTY;
          this.area = data[0].CITY;

          if(this.country) {
            this.DetailsForm.get('state')?.setValue(this.states);
            this.DetailsForm.get('town_city')?.setValue(this.town_city);
            this.DetailsForm.get('area')?.setValue(this.area);
          }

        } else {
          this.country = '';
          this.states = '';
          this.town_city = '';
          this.area = [];
        }
      });
  }

  // pincode
  onPostalCodeInputChange() {
  const postalCodeValue = this.DetailsForm?.get('pincode')?.value;
  this.postalCodeService.getDetailsByPostalCode(postalCodeValue).pipe(
    debounceTime(500),
    distinctUntilChanged())
    .subscribe((data)=>{
       });
    this.postalCodeInput.next(postalCodeValue);
  }

  ChangeHanlder(event: boolean) {
    this.show = event;
    this.AddressHandler.emit(false);
    this.DetailsForm.reset();
  }



  ngOnChanges() {
    if (!this.receiveData) {
        this.title = 'Add New Address';
        this.DetailsForm.reset();
    } else {
        this.title = 'Edit Address';
        this.DetailsForm.patchValue(this.receiveData.data);
    }

    if (this.ShowComponent) {
        this.show = true;
    }
}


  async SaveAddress() {
      let result;
      if (this.receiveData) {
        const body =this.DetailsForm.value;
        body._id = this.receiveData.data._id;
        this.fetchService.HTTPPOST(this.backendURLs.URLs.updateAddress, body).subscribe({next:(result)=>{
          this.AddressHandler.next({ data: body, index: this.receiveData.index });
        },error:()=>{
        }});
      }
      else {
    this.fetchService.HTTPPOST(this.backendURLs.URLs.addAddress, JSON.parse(JSON.stringify(this.DetailsForm.value))).subscribe((result)=>{
          this.AddressHandler.next(result);
        });
      }

      
    
    this.DetailsForm.reset();
    this.show = false;
    this.AddressHandler.emit(false);
  }

  StateHandler(event: any) {
    this.DetailsForm.get('state')?.setValue(event);
  }


  PhoneNoValidator(control: FormControl){
    if(control.value?.length<10) return {error:true};
    if(!Number(control.value)) return {error:true};
    return null;
    
  }

}


