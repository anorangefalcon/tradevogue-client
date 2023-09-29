import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent  {
  showData : string = "profile";
  OrderLength:number=0;

  changeComponent(el:string){
    this.showData=el;
  }

  @ViewChild('expand') ExpandBtn:ElementRef | undefined;
  isReadOnly:boolean=true;
  
  signupForm:FormGroup;

  userData:any='';
  CurrentPage:number=1;
  entriesCount:number=7;
  TotalPages:number=0;
  constructor(private renderer: Renderer2,private routerlinkservice:RouterLinksService,private fb:FormBuilder,private el: ElementRef, private userService:FetchDataService){
   
   
   
    this.signupForm= fb.group(
  
      
      {
        name:fb.control('',[Validators.required]),
        
        username:fb.control('',[Validators.required]),
        email:fb.control('',[Validators.email,Validators.required]),
        mobileNo:fb.control('',[Validators.email,Validators.required]),
        gender:fb.control('',[Validators.email,Validators.required]),
        dob:fb.control('',[Validators.email,Validators.required]),
        address:fb.control('',[Validators.email,Validators.required]),
     
      });   

   
    this.getData();
    this.routerlinkservice.showDataValue.subscribe((data:string)=>{
      this.showData=data;
    });
   
  };





async  getData(){

await this.userService.getUserData().subscribe((data:any)=>{

  this.userData=data.filter((el:any)=>el.userId==1)[0];
  this.OrderLength=this.userData.orders.length;
  this.OrderLength=100;
  this.PageCount();
});


}



PageCount(){
  
  if(!(this.OrderLength/this.entriesCount)) return;
 
  if(this.OrderLength%this.entriesCount){
    
    
    this.TotalPages=Math.ceil(this.OrderLength/this.entriesCount);
  }

  else{
    this.TotalPages=(this.OrderLength/this.entriesCount);
  }

 
}



  editClick(){
    
  this.isReadOnly=!this.isReadOnly;

    }



 
  
  ViewProduct(order:any){
    order.expanded=!order.expanded;
    if(order.expanded){
      this.renderer.setProperty(this?.ExpandBtn?.nativeElement,'innerHTML',"expand_less")
    }
    else{
      this.renderer.setProperty(this?.ExpandBtn?.nativeElement,'innerHTML',"expand_more")
    }
   
  }


  PreviousPage(){
    if(this.CurrentPage==1) return;
    this.CurrentPage-=1;
  }

  NextPage(){
    if(this.CurrentPage>=this.TotalPages) return;
    this.CurrentPage+=1;
  }

  Gotopage(el:number){
    this.CurrentPage=el;
  }

}
