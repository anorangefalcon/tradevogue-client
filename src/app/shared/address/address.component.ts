import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
// import { MobileNoValidator } from '';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  display:boolean = false;
  direction:string='right';
// direction: string='top';

show:boolean=false;
  // direction:string='right';
  addnewAddress:boolean=false;
  StateOptions:any=['Punjab','Bihar','Delhi'];
  @Input() receiveData:any;
  @Input() ShowComponent:any;
  // @Input() visibleClass: boolean | undefined;
  states:any[]=['Punjab','Delhi','UP'];
  // closeAddress:boolean=false;

  DetailsForm: FormGroup;
  constructor(private fetchService:FetchDataService, private userService:UserServiceService, private backendURLs: UtilsModule,private fb: FormBuilder){
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
        // mobile:fb.control('', [Validators.required,this.PhoneNumberValidator ]),
       
      });


      
  }


 

  ShowDrawer(){
    this.show=true;
  }
  
  ChangeHanlder(event:any){
  this.show=event;  
  }

  PhoneNumberValidator(control:FormControl):boolean{
    const expression=/^\+?[1-9][0-9]{7,14}$/;
    return expression.test(control.value);
  }
  // async ngOnInit() {
  //   // this.AddressData=await this.fetchService.httpGet(this.backendURLs.URLs.getAddress);
  //   // this.AddressData=this.AddressData.info.address;
  // }

  ngOnChanges(){
    // this.ShowComponent=true;
    if(this.ShowComponent==true){
      this.show=true;
    }
    this.DetailsForm.patchValue(this.receiveData.data);
  }

  // RemoveAddressForm(){
  //   this.addnewAddress=false;
  // }

  // AddressData:any=[];
  UpdatingRequest:any

  AddressClose(){
    this.DetailsForm.reset(); 
    this.closeaddressed.emit(false);
  
  }


  // close(){
  //   this.display=false;
  // }

  // // AddressHandler(event:any){
  // //   this.display=false;
  // //   if(!event._id){

  // //     this.AddressData.push(event);
  // //     return;
  // //   }

  // //   this.AddressData[event.index]=event;

    
  // // }

  // AddressHandler(){

  // }
  // Edit(el:any,index :any){
  //   el.index=index;
  //   this.UpdatingRequest=el;
  //   this.display=true;
  // }

  @Output() newAddress: EventEmitter<any> =   new EventEmitter();
  @Output() closeaddressed: EventEmitter<any> =   new EventEmitter();
  async AddnewAddress(){
    try { 
      let result;
      if(this.receiveData){
       const body=JSON.parse(JSON.stringify(this.DetailsForm.value));
        body._id=this.receiveData.data._id; 
        result= await this.fetchService.httpPost( this.backendURLs.URLs.updateAddress,body);
        result=JSON.parse(JSON.stringify(result));
        result.index=this.receiveData.index;
      }
      else{
        result= await this.fetchService.httpPost( this.backendURLs.URLs.addAddress,this.DetailsForm.value);
      }
    
     let addresses:any = await this.userService.SubscribingValue('userAddresses');
     if(addresses){
      addresses.push(result);
     await this.userService.emittingValue('userAddresses',addresses);
     }
     else{
       await this.userService.emittingValue('userAddresses',[result]);
     }
     
      // this.newAddress.emit(result);
      this.DetailsForm.reset();
     
    } 
    catch (error) {    
    }
    this.AddressClose();
 
  }

  StateHandler(event:any){
    this.DetailsForm.get('state')?.setValue(event);
  }
  

  
}
