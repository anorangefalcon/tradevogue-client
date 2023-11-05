import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent {
OfferForm:FormGroup;
title='Add Coupon/Discount';
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
couponType=['global', 'custom','new'];
Brands:any;
EditIndex:any;
allOffers:any;
Categories:any;
Filters=['categories','brands'];
CouponRequest:boolean=false;
selectAll: boolean = false;
deleteList : any = [];



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
      const body=['categories','brands']
     this.fetchDateService.HTTPPOST( this.BackendUrls.URLs.fetchFeatures,body).subscribe((data:any)=>{
      this.Brands=data.brands;
      this.Categories=data.categories;
     })
      
  }

  toggleSelectAll() {
    this.allOffers.forEach((product: any) => {
      product.checked = this.selectAll;
    });
  }

  checkboxChanged() {
    if (this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllcheckboxChecked() {
    return this.allOffers.every((product: any) => product.checked);
  }

  updateCheckList() {
    this.deleteList = [];
    this.allOffers.forEach((product: any) => {
      if (product.checked) this.deleteList.push(product._id);
    });
  }


  CouponCodeValidator(control: FormControl){
    if(!control.value) return null;
    if(control.value.includes(' ')){
      return {error:true}
    }
    return null;
  }

  ParenClosedHandler(event:any){   
    console.log('event comingi is=========>',event);
     
    this.ParenClosed=event;
  }

  DateValidator(control:AbstractControl){
    let currentTime:any=new Date();
    currentTime=currentTime.getTime();
    let errors:any={};
    let startDate=control.get('startDate')?.value;
    startDate=new Date(startDate).getTime();
    let endDate=control.get('endDate')?.value;
  if(!startDate || !endDate) return null;
    endDate=new Date(endDate).getTime();
    if(startDate<currentTime){
    control.get('startDate')?.setErrors({'format':"incorrect"});
    }

    if(endDate<startDate){
      control.get('endDate')?.setErrors({'format':"incorrect"});
    }

    return null;

  }

  OfferTypeHandler(event:any){
    this.OfferForm.get('OfferType')?.patchValue(event);
    const controls :any= [
      { name: 'couponcode',validator:this.CouponCodeValidator},
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
      this.OfferForm.addControl('email', this.fb.control('', [Validators.email,Validators.required]));
    }
    
  }

async ngOnInit(){
 this.fetchDateService.HTTPGET(this.BackendUrls.URLs.getOffers).subscribe((data)=>{
      this.allOffers=data;
    });    
}
currentPage: number = 1
pageChange(e: any){
  this.currentPage = e;
  // this.fetchData();
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


  PercentageValidator(control:AbstractControl){
    if(control.value>=0 && control.value<=100){
      return null;
    }
    return {error:true}
  }


  DiscountTypeHandler(event:any){
   this.OfferForm.get('discountType')?.patchValue(event);
   if(this?.OfferForm?.get('discountType')?.value=='percentage'){
      this.OfferForm.get('discountAmount')?.setValidators([this.PercentageValidator])
   }

   else{
    this.OfferForm.get('discountAmount')?.removeValidators(this.PercentageValidator)
   }

   }

  // DiscountPercentageHandler(event:any){
  //   this.OfferForm.get('DiscountPercentageType')?.patchValue(event);
  // }
  
  async CouponSubmit(){
    let url;
    let body:any=this.OfferForm.value;
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
        this.ParenClosed=true;  
        this.OfferForm.reset();
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
    if(data.email) this.CouponTypeHandler('custom');
    this.OfferForm.patchValue(data);
    this.show=true;
    this.CouponRequest=true 
  }


}
