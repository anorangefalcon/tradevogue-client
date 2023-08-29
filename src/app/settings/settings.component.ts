import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showData:any='orders';

  // change component click listener
  changeComponent(el:any){
    this.showData=el;
  }


  @ViewChild('myButton') myButton: ElementRef | undefined;
  isReadOnly:boolean=true;
  
  signupForm:any;

  userData:any;
  constructor(private renderer: Renderer2,private fb:FormBuilder, private userService:FetchDataService){
    this.signupForm= fb.group(
  
      
      {
        username:fb.control('',[Validators.required]),
        email:fb.control('',[Validators.email,Validators.required]),
        password:fb.control('',[Validators.required,Validators.minLength(8)]),
        confirmPassword: fb.control('',[Validators.required,])
        
      });   

      this.getData();
    // call to service
  
  //     console.log("data is ",data);
  //     this.userData=data;
  //   });
      

     
  };


async  getData(this: any){
// const x= this.userService?.getUserData();
await this.userService.getUserData().subscribe((data:any)=>{
  console.log("data is",data);
  const x=data.filter((el:any)=>el.userId==1);
  // console.log("x is s",x);
  this.userData=x[0];
  
});

// console.log("userdata is ",this.userData);
}



 
  editClick(){
    
    const x=(this?.myButton?.nativeElement.innerHTML);
   
    this.isReadOnly=!this.isReadOnly;
    if(x=='Edit Details'){
      
      this.renderer.setProperty(this?.myButton?.nativeElement, 'innerHTML', 'Save');
      
    }
    else{
      this.renderer.setProperty(this?.myButton?.nativeElement, 'innerHTML', 'Edit Details');
    }

    
    
    
   
   
  }
}
