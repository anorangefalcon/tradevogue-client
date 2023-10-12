import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';

import {MobileNoValidator} from './validators';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showData: string = "profile";
  OrderLength: number = 0;

  changeComponent(el: string) {
    this.showData = el;
  }

  @ViewChild('expand') ExpandBtn:ElementRef | undefined;
  isReadOnly:boolean=true;
  

  changePasswordForm:FormGroup;
  ProfileForm:FormGroup;

  userData:any='';
  CurrentPage:number=1;
  entriesCount:number=7;
  TotalPages:number=0;
  

  @ViewChild('EditBtn') EditBtn: ElementRef | undefined;
 
  constructor(private renderer: Renderer2,private backendURLs:UtilsModule, private fetchDataService:FetchDataService,private routerlinkservice:RouterLinksService,private fb:FormBuilder,private el: ElementRef, private userService:FetchDataService){
 
    this.ProfileForm= fb.group(
      {
        firstname:fb.control(''),
        lastname:fb.control(''),
        email:fb.control('',[Validators.email,Validators.required]),
        mobile:fb.control('',[MobileNoValidator]),
        gender:fb.control('',),
        dob:fb.control(''),
        
     
      });   

 

    this.changePasswordForm = fb.group({
      currentPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
      againNewPassword: fb.control('', [Validators.required, (control: any) => matchPasswordValidator(control, this.changePasswordForm)])
    })

    this.getData();
    this.routerlinkservice.showDataValue.subscribe((data: string) => {
      this.showData = data;
    });

  };

 
  async ngOnInit(){
    try {
      const data:any=await this.fetchDataService.httpGet(this.backendURLs.URLs.getDetails);
      console.log("data is  comign is ",data);
      data.firstname=data.name.firstname;
      data.lastname=data.name.lastname;
      data.gender=data.info.gender;
      // console.log("date is ",;
      data.dob=data.info.dob.split('T')[0];
      this.ProfileForm.patchValue(data);


    } catch (error) {
      
    }
  }

  async onPasswordChange(){
    try {
      const body = {
        oldPassword : this.changePasswordForm.get('currentPassword')?.value,
        newPassword : this.changePasswordForm.get('newPassword')?.value
      }
      const data = await this.userService.httpPost(this.backendURLs.URLs.changePassword, body)
    }
    catch (error) {

    }

  }

 


async  getData(){

await this.userService.getUserData().subscribe((data:any)=>{

  this.userData=data.filter((el:any)=>el.userId==1)[0];
  this.OrderLength=this.userData.orders.length;
  this.OrderLength=100;
  this.PageCount();
});


}




  PageCount() {

    if (!(this.OrderLength / this.entriesCount)) return;

    if (this.OrderLength % this.entriesCount) {


      this.TotalPages = Math.ceil(this.OrderLength / this.entriesCount);
    }

  }

  editClick(){
    
  this.isReadOnly=!this.isReadOnly;
}


DetailsSubmitted:Boolean=false;
async saveDetails(){

this.DetailsSubmitted=true;
if(this.ProfileForm.invalid) return;

  let body={
    name : {firstname:this.ProfileForm.get('firstname')?.value, lastname:this.ProfileForm.get('lastname')?.value},
    email : this.ProfileForm.get('email')?.value,
    mobile:this.ProfileForm.get('mobile')?.value,
    "info.gender":this.ProfileForm.get('gender')?.value,
    "info.dob":new Date(this.ProfileForm.get('dob')?.value)
  }
 let response= await this.fetchDataService.httpPost(this.backendURLs.URLs.updateDetails,body);
this.isReadOnly=!this.isReadOnly;
}

  








  ViewProduct(order: any) {
    order.expanded = !order.expanded;
    if (order.expanded) {
      this.renderer.setProperty(this?.ExpandBtn?.nativeElement, 'innerHTML', "expand_less")
    }
    else {
      this.renderer.setProperty(this?.ExpandBtn?.nativeElement, 'innerHTML', "expand_more")
    }

  }



  PreviousPage() {
    if (this.CurrentPage == 1) return;
    this.CurrentPage -= 1;
  }

  NextPage() {
    if (this.CurrentPage >= this.TotalPages) return;
    this.CurrentPage += 1;
  }

  Gotopage(el: number) {
    this.CurrentPage = el;
  }

  }