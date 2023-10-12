import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';
import { UtilsModule } from '../utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';

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
  
  signupForm:FormGroup;
  changePasswordForm:FormGroup;
  userData:any='';
  CurrentPage:number=1;
  entriesCount:number=7;
  TotalPages:number=0;
  

  @ViewChild('EditBtn') EditBtn: ElementRef | undefined;
 

  constructor(private renderer: Renderer2, private routerlinkservice: RouterLinksService, private fb: FormBuilder, private el: ElementRef, private userService: FetchDataService) {

    this.signupForm = fb.group({
        name: fb.control('', [Validators.required]),
        username: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.email, Validators.required]),
        mobileNo: fb.control('', [Validators.email, Validators.required]),
        gender: fb.control('', [Validators.email, Validators.required]),
        dob: fb.control('', [Validators.email, Validators.required]),
        address: fb.control('', [Validators.email, Validators.required]),
        });

    this.changePasswordForm = fb.group({
      currentPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
      againNewPassword: fb.control('', [Validators.required, (control: any) => matchPasswordValidator(control, this.signupForm)])
    })

    this.getData();
    this.routerlinkservice.showDataValue.subscribe((data: string) => {
      this.showData = data;
    });

  };

 

  async onPasswordChange(){
    try {
      const body = {
        oldPassword : this.changePasswordForm.get('currentPassword')?.value,
        newPassword : this.changePasswordForm.get('newPassword')?.value
      }
    }
    catch {}

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
// const data=this.renderer.getProperty(this?.EditBtn?.nativeElement,'innerHTML');
let CurrentContent:string = this?.EditBtn?.nativeElement.innerHTML; 
if(CurrentContent=='Edit Profile'){
  this.renderer.setProperty(this?.EditBtn?.nativeElement,'innerHTML',"Save")  
}
else{
  this.renderer.setProperty(this?.EditBtn?.nativeElement,'innerHTML',"Edit Profile")  
}
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