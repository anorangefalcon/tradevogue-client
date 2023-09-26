import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent  {
  showData : string = "orders";
  OrderLength:number=0;
  // showProfile(){
  //   this.showData = 'orders';
  // }
  // showOrders(){
  //   this.showData = 'orders';
  // }

  // change component click listener
  changeComponent(el:any){
    console.log('EL IS ',el);
    
    this.showData=el;
    // console.log();
    
  }


  @ViewChild('myButton') myButton: ElementRef | undefined;
  @ViewChild('expand') ExpandBtn:ElementRef | undefined;
  isReadOnly:boolean=true;
  
  signupForm:any;
  PaginationArray:any[]=[];
  userData:any='';
  CurrentPage:number=1;
  ShownPages:number=7;
  TotalPages:number=0;
  constructor(private renderer: Renderer2,private fb:FormBuilder,private el: ElementRef, private userService:FetchDataService, private routerService : RouterLinksService){
   
   
   
    this.signupForm= fb.group(
  
      
      {
        name:fb.control('',[Validators.required]),
        
        username:fb.control('',[Validators.required]),
        email:fb.control('',[Validators.email,Validators.required]),
        mobileNo:fb.control('',[Validators.email,Validators.required]),
        gender:fb.control('',[Validators.email,Validators.required]),
        dob:fb.control('',[Validators.email,Validators.required]),
        address:fb.control('',[Validators.email,Validators.required]),
        // password:fb.control('',[Validators.required,Validators.minLength(8)]),
        // confirmPassword: fb.control('',[Validators.required,])
        
      });   

   
    
   
  };

  ngOnInit() {
 
    this.getData();
    
  }



async  getData(this: any){

await this.userService.getUserData().subscribe((data:any)=>{

  const x=data.filter((el:any)=>el.userId==1);
 
  this.userData=x[0];
  
  this.OrderLength=this.userData.orders.length;

  this.OrderLength=100;
  this.CreateArray();
});


}



CreateArray(){
  
  if(!(this.OrderLength/this.ShownPages)) return;
  let pages:any;
  if(this.OrderLength%this.ShownPages){
    
    
    this.TotalPages=Math.ceil(this.OrderLength/this.ShownPages);
  }

  else{
    this.TotalPages=(this.OrderLength/this.ShownPages);
  }

  if(this.TotalPages<=7){
    this.ShownPages=this.TotalPages;
  }

  for(let i=0;i<this.ShownPages;i++){
    this.PaginationArray.push(i+1);
  }
  console.log("Created array is ",this.PaginationArray);

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



  Expand:boolean=false;
  
  ViewProduct(order:any){
    this.Expand=true;
    console.log("orer is ",order.expanded);
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

  Gotopage(el:any){
    this.CurrentPage=el;
  }

}
