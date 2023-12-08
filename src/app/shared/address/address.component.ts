import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PincodeService } from 'src/app/shared/services/pincode.service';

// import {}
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

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

  constructor(private fetchService: FetchDataService, private backendURLs: UtilsModule, private fb: FormBuilder, private postalCodeService: PincodeService) {
    this.DetailsForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        apartment: fb.control('', [Validators.required]),
        area: fb.control('', [Validators.required]),
        landmark: fb.control('', [Validators.required,]),
        pincode: fb.control('', [Validators.required, Validators.pattern('^[1-9]\\d{5}$')]),
        town_city: fb.control('', [Validators.required,]),
        state: fb.control('', [Validators.required,]),
        mobile: ['', [Validators.required,this.PhoneNoValidator,]],
      });
  }


  // pincode
 async onPostalCodeInputChange() {
  const postalCodeValue = this.DetailsForm?.get('pincode')?.value;
  // const data=await fetch(`http://www.postalpincode.in/api/pincode/141007`);
  // console.log("data come up is ",this.DetailsForm)
  this.postalCodeService.getDetailsByPostalCode(postalCodeValue).pipe(
    debounceTime(500),
    distinctUntilChanged())
    .subscribe((data)=>{
      console.log("data come up is ",data);

       });

  //   this.postalCodeInput.next(postalCodeValue);
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


