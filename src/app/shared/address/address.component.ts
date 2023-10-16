import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  display:boolean = false;
  addnewAddress:boolean=false;
  
  @Input() visibleClass: boolean | undefined;

  closeAddress:boolean=false;

  DetailsForm: FormGroup;
  constructor(private fetchService:FetchDataService, private backendURLs: UtilsModule,private fb: FormBuilder){
    this.DetailsForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        apartment: fb.control('', [Validators.required]),
        area: fb.control('', [Validators.required]),
        landmark: fb.control('', [Validators.required, ]),
        pincode: fb.control('', [Validators.required, ]),
        town_city:fb.control('', [Validators.required, ]),
        state:fb.control('', [Validators.required, ]),
        // country:fb.control('', [Validators.required, ]),
      });

      console.log('VISIBLE CLASS IS ',this.visibleClass);
      

  }

  RemoveAddressForm(){
    this.addnewAddress=false;
  }
  AddressData:any=[];
  UpdatingRequest:any

  AddressClose(){
    // this.closeAddress=true;
    // this.visibleClass=false;
    this.closeaddressed.emit(false);
  }
  async ngOnInit() {
    this.AddressData=await this.fetchService.httpGet(this.backendURLs.URLs.getAddress);
    this.AddressData=this.AddressData.info.address;
  
  }

  close(){
    this.display=false;
  }

  // AddressHandler(event:any){
  //   this.display=false;
  //   if(!event._id){

  //     this.AddressData.push(event);
  //     return;
  //   }

  //   this.AddressData[event.index]=event;

    
  // }

  AddressHandler(){

  }
  Edit(el:any,index :any){
    el.index=index;
    this.UpdatingRequest=el;
    this.display=true;
  }

  @Output() newAddress: EventEmitter<any> =   new EventEmitter();
  @Output() closeaddressed: EventEmitter<any> =   new EventEmitter();
  async AddnewAddress(){
    console.log("addreess added to be ",this.DetailsForm.value);
    try { 
      let data:any= await this.fetchService.httpPost( this.backendURLs.URLs.addAddress,this.DetailsForm.value);
      console.log('data coming is ',data);
      

      this.newAddress.emit(data);
    
    } catch (error) {
        console.log('error coming is ',error);
        
    }
 
  }

}
