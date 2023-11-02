import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent {
OfferForm:FormGroup;
FormSubmiited:boolean=false;
direction: string='right';
ParenClosed:boolean=false;
show:boolean=false;

ShowDrawer(){
  this.show=true;
}

ChangeHanlder(event:any){
this.show=event;  
}

OfferType=['coupon','discount'];
discountType=['percentage','flat'];
// DiscountPercentageType=['fixed','variable'];
couponType=['global', 'custom','new'];
Brands:any;
EditIndex:any;
allOffers:any;
Categories:any;
Filters=['categories','brands'];
CouponRequest:boolean=false;



constructor(private fb:FormBuilder,private fetchDateService:FetchDataService,private BackendUrls:UtilsModule){



    this.OfferForm = fb.group(
      { OfferType:fb.control('', [Validators.required]),
        Title: fb.control('', [Validators.required]),
        Description: fb.control('', [ Validators.required]),
        discountType: fb.control('', [Validators.required, ]),
        discountAmount: fb.control('', [Validators.required]),
        startDate: fb.control('', [ Validators.required]),
        endDate: fb.control('', [Validators.required, ]),
        maximumDiscount:fb.control('', [Validators.required]),
      },
      {  validator: this.DateValidator}
      )


      // this.getDates();
    
  }


  CouponCodeValidator(control: FormControl){
    if(control.value.includes(' ')){
      return {error:true}
    }
    return null;
  }

  ParenClosedHandler(event:any){
    this.ParenClosed=event;
  }

  DateValidator(control:AbstractControl){
    let currentTime:any=new Date();
    currentTime=currentTime.getTime();
    let errors:any={};
    let startDate=control.get('startDate')?.value;
    startDate=new Date(startDate).getTime();
    let endDate=control.get('endDate')?.value;
    endDate=new Date(endDate).getTime();
    if(startDate<currentTime){
    control.get('startDate')?.setErrors({'format':"incorrect"});
    }

    if(endDate<startDate){
      control.get('endDate')?.setErrors({'format':"incorrect"});
    }

    return null;

  }


  // getDates(){
  //   const currentDate = new Date();
  //   let endDate = new Date(currentDate);
  //   endDate.setDate(currentDate.getDate() + 1);
  
  //   const day = currentDate.getDate();
  //   const month = currentDate.getMonth() + 1;
  //   const year = currentDate.getFullYear();
  
  //   const endDateDay = endDate.getDate();
  //   const endDateMonth = endDate.getMonth() + 1;
  
  //   const startDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  //   const endDateFormatted = `${endDateDay < 10 ? '0' : ''}${endDateDay}/${endDateMonth < 10 ? '0' : ''}${endDateMonth}/${year}`;
  
  //   console.log('startDate is', startDate, 'end Date is', endDateFormatted);
  
  //   return { startDate, endDate: endDateFormatted };
  // }

  

  OfferTypeHandler(event:any){
    this.OfferForm.get('OfferType')?.patchValue(event);
    const controls :any= [
      { name: 'couponcode'},
      { name: 'couponType', },
      { name: 'couponUsersLimit' },
      { name: 'minimumPurchaseAmount' },
    ];


    if(event=='coupon'){
      if(this.OfferForm.get('ExtraInfo')){
         this.OfferForm.removeControl('ExtraInfo');
         this.OfferForm.removeControl('DiscountPercentageHandler');
      }
   


      // this.OfferForm.addFor
      controls.forEach((el:any)=>{
        if(el.validator){
          this.OfferForm.addControl(el.name, this.fb.control('', [Validators.required,el.validator]));
        }
        else{
          this.OfferForm.addControl(el.name, this.fb.control('', [Validators.required]));
        }
        
      })



    }

    if(event == 'discount'){

      // if(this.)
      
      controls.forEach((el:any)=>{
        this.OfferForm.removeControl(el.name);
      })
      console.log('OFFERFORM AFTER HANDLER ',this.OfferForm);

    
      let ExtraInfo=this.fb.group({
        categories:[],
        brands:[]
      });

      
    
      this.OfferForm.addControl('ExtraInfo',ExtraInfo);
    }
    
  }


  CouponTypeHandler(event:any){
    this?.OfferForm?.get('couponType')?.patchValue(event);
    if(event=='custom'){
      this.OfferForm.addControl('email', this.fb.control('', [Validators.email]));
    }
    
  }

async ngOnInit(){
 this.fetchDateService.HTTPGET(this.BackendUrls.URLs.getOffers).subscribe((data)=>{
      this.allOffers=data;
    });
    
}


  AddCoupon(){
    this.OfferForm.reset();
    this.show=true;
    this.EditRequest=false;
  }

  CancelCoupon(){
    this.CouponRequest=false;
  }


  CategoriesHandler(event:any){    
   this.OfferForm.get('ExtraInfo')?.get('categories')?.patchValue(event); 
  }


  BrandsHandler(event:any){
    this.OfferForm.get('ExtraInfo')?.get('brands')?.patchValue(event);
  }


  DiscountTypeHandler(event:any){
   this.OfferForm.get('discountType')?.patchValue(event);
  //  this.OfferForm.addControl('DiscountPercentageType', this.fb.control('', [Validators.required]));
   }

  // DiscountPercentageHandler(event:any){
  //   this.OfferForm.get('DiscountPercentageType')?.patchValue(event);
  // }
  
  async CouponSubmit(){
    let url;
    let body=this.OfferForm.value;
    if(this.EditRequest){
      url=this.BackendUrls.URLs.updateOffer;
        body.id=this.EditRequest;      
    }
    else{
      url=this.BackendUrls.URLs.createOffer;
    }
this.fetchDateService.HTTPPOST(url,body).subscribe((data)=>{
        if(this.EditRequest){
          this.allOffers[this.EditIndex]=data;
          this.EditRequest=false;
        }
        else{
          this.allOffers.push(data);
        }
        this.OfferForm.reset();
        this.ParenClosed=true;
        
      });
  return;  

  }


  async DeleteOffer(element:any,index:any){
        const body={id:element._id};
 this.fetchDateService.HTTPPOST(this.BackendUrls.URLs.deleteOffer,body).subscribe((data)=>{
   this.allOffers.splice(index,1);
 });
     
  }


  // function 


  EditRequest:any;

  async EditOffer(data:any,index:any){
    this.EditIndex=index;
    this.EditRequest=data._id;
    data.startDate=data.startDate.split('T')[0];

    data.endDate=data.endDate.split('T')[0];

    
    this.OfferTypeHandler(data.OfferType);
    this.DiscountTypeHandler(data.discountType);
  

    this.OfferForm.patchValue(data);
    // console.log('OFferform is ',this.OfferForm.value);
    // this.userService.DrawerClose.next(false);
    this.show=true;
    this.CouponRequest=true
  
    
  }


}
