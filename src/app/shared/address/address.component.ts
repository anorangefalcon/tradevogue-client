import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
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
  @Input() receiveData: any;
  @Input() ShowComponent: any;
  @Output() AddressHandler: EventEmitter<any> = new EventEmitter();
  states: any[] = ['Punjab', 'Delhi', 'UP'];
  DetailsForm: FormGroup;

  constructor(private fetchService: FetchDataService, private userService: UserServiceService, private backendURLs: UtilsModule, private fb: FormBuilder) {
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
  }

  ParentClosedHandler(event: any) {
    this.ParenClosed = event;

  }

  ngOnChanges() {
    if (this.ShowComponent == true) {
      this.show = true;
    }
    if (this.receiveData) {
      this.DetailsForm.patchValue(this.receiveData.data);
    }

  }


  async AddnewAddress() {
    try {
      let result;
      if (this.receiveData) {
        const body = JSON.parse(JSON.stringify(this.DetailsForm.value));
        body._id = this.receiveData.data._id;
        body.status = true;
        result = await this.fetchService.httpPost(this.backendURLs.URLs.updateAddress, body);
        result = JSON.parse(JSON.stringify(result));
        this.AddressHandler.next({ data: this.DetailsForm.value, index: this.receiveData.index });
      }
      else {
        result = await this.fetchService.httpPost(this.backendURLs.URLs.addAddress, this.DetailsForm.value);
        this.AddressHandler.next({ data: this.DetailsForm.value });

      }

    }
    catch (error) {
    }

    // this.show=(false);
    this.DetailsForm.reset();
    this.ParenClosed = true;

  }

  StateHandler(event: any) {
    this.DetailsForm.get('state')?.setValue(event);
  }



}
