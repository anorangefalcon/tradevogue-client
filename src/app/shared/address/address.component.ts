import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// import {}
import { PhoneNumberValidator } from '../../auth/validators';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {

  ParenClosed: boolean = false;
  direction: string = 'right';
  show: boolean = false;
  title!:string;
  @Input() receiveData: any;
  @Input() ShowComponent: any;
  @Output() AddressHandler: EventEmitter<any> = new EventEmitter();
  states: any[] = ['Punjab', 'Delhi', 'UP'];
  DetailsForm: FormGroup;

  constructor(private fetchService: FetchDataService, private backendURLs: UtilsModule, private fb: FormBuilder) {
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
        mobile: ['', [Validators.required, PhoneNumberValidator]],

      });


  }

  ChangeHanlder(event: any) {
    this.show = event;
    this.AddressHandler.emit(false);
    this.DetailsForm.reset();
  }

  ParentClosedHandler(event: any) {
    this.ParenClosed = event;
  }

  ngOnChanges() {
    if (this.ShowComponent == true) {
      this.show = true;
    }
    console.log('edit address is ',this.receiveData);
    
    if (this.receiveData) {
      this.title='Edit Address';
      this.DetailsForm.patchValue(this.receiveData.data);
    }
    if(!this.receiveData){
      this.title='Add New Address';
      this.DetailsForm.reset();
    } 
      
  }


  async SaveAddress() {
    console.log('save clicked ----------> ',this.DetailsForm," recieve data is ",this.receiveData);
    
    try {
      let result;
      if (this.receiveData) {
        const body = JSON.parse(JSON.stringify(this.DetailsForm.value));
        body._id = this.receiveData.data._id;
        body.status = true;
        this.fetchService.HTTPPOST(this.backendURLs.URLs.updateAddress, body).subscribe((result)=>{
          console.log('edited data====>');
          
          this.AddressHandler.next({ data: this.DetailsForm.value, index: this.receiveData.index });
        });
        // result = JSON.parse(JSON.stringify(result));
      }
      else {
    this.fetchService.HTTPPOST(this.backendURLs.URLs.addAddress, JSON.parse(JSON.stringify(this.DetailsForm.value))).subscribe((result)=>{
      console.log('data coming is ',result);
      
          this.AddressHandler.next({ data:  this.DetailsForm.value});
        });
      }

      // this.DetailsForm.reset();
    }
    catch (error) {
    }

    // this.show=(false);
    this.DetailsForm.reset();
    // this.ParenClosed = true;

  }

  StateHandler(event: any) {
    this.DetailsForm.get('state')?.setValue(event);
  }



}
