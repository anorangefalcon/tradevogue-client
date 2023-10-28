import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';
// import { ToastService } from '../shared/services/toast.service';
import { MobileNoValidator } from './validators';
import { PopupService } from '../shared/services/popup.service';
import { Subject } from 'rxjs';
import { UserServiceService } from '../shared/services/user-service.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showData: string = "profile";
  isReadOnly: boolean = true;
  changePasswordForm: FormGroup;
  ShowComponent:boolean=false;
  ProfileForm: FormGroup;
  showPassword : boolean = false;
  showPassword2 : boolean = false;
  showPassword3 : boolean = false;
  password : string = "password";
  password2 : string = "password";
  password3 : string = "password";
  AddressSended:boolean=false;
  receiveData:any;

  // addnewAddress:boolean=false;
  userAddresses!:any;
  TranslateData:boolean=false;


// private toastService: ToastService
  constructor( private backendURLs: UtilsModule, private userService:UserServiceService,  private fetchDataService: FetchDataService, private fb: FormBuilder ) {

    this.ProfileForm = fb.group(
      {
        firstname: fb.control(''),
        lastname: fb.control(''),
        email: fb.control('', [Validators.email, Validators.required]),
        mobile: fb.control('', [MobileNoValidator]),
        gender: fb.control('',),
        dob: fb.control(''),


      });


    this.changePasswordForm = fb.group({
      currentPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
      againNewPassword: fb.control('', [Validators.required, (control: any) => matchPasswordValidator(control, this.changePasswordForm)])
    })

    // this.userService.
    // this.
  

  };

  changeComponent(el: string) {
    this.showData = el;
    this.TranslateData = true;
  }

  // async ngOnInit(){
  //   try {
  //     const Details:any=await this.fetchDataService.httpGet(this.backendURLs.URLs.getDetails);
  //     this.ProfileForm.patchValue(Details);
  //   } catch (error) {
      
  //   }
  // }

  async ngOnInit() {
    try {
      const data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getDetails);
      data.firstname = data.name.firstname;
      data.lastname = data.name.lastname;
      data.gender = data.info.gender;
      if(data.info.dob){
        data.dob = data.info.dob.split('T')[0];
      }
      this.ProfileForm.patchValue(data);
 
    } catch (error) {

    }
  }

  async getAddresses(){
    
    this.showData='addresses';
    this.TranslateData = true;
    let Addresses=await this.userService.SubscribingValue('userAddresses'); 
    if(!Addresses){
      let data:any=await  this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
      data=data.addresses;
      if(data.length!=0){
        await this.userService.emittingValue('userAddresses',data);
        this.userAddresses=data;  
      } 
    }

    else{
      this.userAddresses=Addresses;
    }
  }

  AddAddress(){
    this.ShowComponent=true;
  }


  // CloseAddress(){
  //   // this.addnewAddress=false;
  // }


  AddresscloseHandler(event:any){
    this.ShowComponent=event;
    this.receiveData='';
  }

  NewAddressHandler(event:any){
    if(event.hasOwnProperty("index")){
       this.userAddresses[event.index]=event;      
      return;
    }
      this.userAddresses.push(event);
    // this.userAddresses=(event.info.address);
  }


  async RemoveAddress(address:any,index:any){
    try{
      const body={address_id:address._id}
      let deleteAddress=await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteAddress,body);
      this.userAddresses.splice(index,1);
    }
    catch(error){
    }
     
  }



  EditAddress(address:any,index:any){
    const data=this.userAddresses[index];
    console.log('data and is ',data);
    
    // this.AddressSended={ data: data, index: index };
    // console.log('AddresseSedned is ',this.AddressSended);
    // this.AddressSended=true;
    this.receiveData={data,index};
    this.ShowComponent=true;
    // this.addnewAddress=true;
  }




 
  TranslateBack(){
    this.TranslateData=false;
  }
  async onPasswordChange() {
    try {
      const body = {
        oldPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }
      const data: any = await this.fetchDataService.httpPost(this.backendURLs.URLs.changePassword, body)

      // this.toastService.successToast({ title: data.message })
    }
    catch (error) {
  
    }

  }




  editClick() {
    this.isReadOnly = !this.isReadOnly;
  }


  DetailsSubmitted: Boolean = false;
  async saveDetails() { 
    console.log('save details clicked--->');
    
    this.DetailsSubmitted = true;
    // if (this.ProfileForm.invalid) return;

    let body = {
      name: { firstname: this.ProfileForm.get('firstname')?.value, lastname: this.ProfileForm.get('lastname')?.value },
      email: this.ProfileForm.get('email')?.value,
      mobile: this.ProfileForm.get('mobile')?.value,
      "info.gender": this.ProfileForm.get('gender')?.value,
      "info.dob": new Date(this.ProfileForm.get('dob')?.value)
    }

    let response = await this.fetchDataService.httpPost(this.backendURLs.URLs.updateDetails, body);
    this.isReadOnly = !this.isReadOnly;
  }

  async MakeDefault(address:any,i:any){
    try {
      const body={address_id:address._id};
      const update:any=await this.fetchDataService.httpPost(this.backendURLs.URLs.setDefaultAddress,body);
        this.userAddresses=update[0].info.address;
      
    } catch (error) {
      
    }
  }
  
}