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
OfferType=['coupon','discount'];
discountType=['percentage','flat'];
DiscountPercentageType=['fixed','variable'];
couponType=['global', 'custom','new'];
Brands:any;
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
        endDate: fb.control('', [Validators.required, Validators.minLength(8), ]),
        maximumDiscount:fb.control('', [Validators.required]),
      },
      {  validator: this.DateValidator}
      )
    
  }


  CouponCodeValidator(control: FormControl){
    if(control.value.includes(' ')){
      return {error:true}
    }
    return null;
  }

  DateValidator(control:AbstractControl){
    // console.log('date validaotr is ',(control.get('startDate')?.value).getTime());

    let currentTime:any=new Date();
    currentTime=currentTime.getTime();
    let errors:any={};
    let startDate=control.get('startDate')?.value;
    startDate=new Date(startDate).getTime();
      // console.log('current time i ',currentTime," selected time is ",currentSelctedDate.getTime() );
    if(startDate<currentTime){
  
      control.get('startDate')?.setErrors({'format':"incorrect"});
      return null;
    }

    let endDate=control.get('endDate')?.value;
    endDate=new Date(endDate).getTime();

    if(endDate<currentTime){
      control.get('endDate')?.setErrors({'format':"incorrect"});
    }

    return null;

  }

  

  OfferTypeHandler(event:any){

    
    this.OfferForm.get('OfferType')?.patchValue(event);
    const controls :any= [
      { name: 'couponcode', validator:this.CouponCodeValidator},
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

    
      let ExtraInfo=this.fb.group({
        category:[],
        brand:[]
      });

      
    
      this.OfferForm.addControl('ExtraInfo',ExtraInfo);
      this.OfferForm.addControl('DiscountPercentageType',['',Validators.required]);
    }
    
  }


  CouponTypeHandler(event:any){
    this?.OfferForm?.get('couponType')?.patchValue(event);
    if(event=='custom'){
      this.OfferForm.addControl('email', this.fb.control('', [Validators.email]));
    }
    
  }

async ngOnInit(){
  try {
    const data:any=await this.fetchDateService.httpGet(this.BackendUrls.URLs.fetchFeatures) 
    this.Categories=data.categories;
    this.Brands=data.brands;
    this.allOffers=await this.fetchDateService.httpGet(this.BackendUrls.URLs.getOffers);
    // console.log('ALL OFFERS IS  ',typeof(allOffers[0].startDate))
    ;
    // this.allOffers=allOffers;
    const productPrice=await this.fetchDateService.httpGet(this.BackendUrls.URLs.getOriginalProductPrice);
    // console.log('PRODICT PRICE SI ',productPrice);
    
  } catch (error) {
  
    
  }
}


  AddCoupon(){
this.CouponRequest=true;
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
    console.log('this is called----------------');
    
   this.OfferForm.get('discountType')?.patchValue(event);
   
  }

  DiscountPercentageHandler(event:any){
    console.log('EVENT IS ',event);
    
  }

  async CouponSubmit(){
    let body=this.OfferForm.value;
    console.log('offefr form is ',this.OfferForm);
    
    try {
      let response=await this.fetchDateService.httpPost(this.BackendUrls.URLs.createCoupon,body);
      this.CouponRequest=false;

      this.allOffers.push(response);
      this.OfferForm.reset();
      return;
      
    } catch (error) {
        console.log('ERROR IS ',error);
        
    }
  }


  async DeleteOffer(element:any,index:any){
    try {
      const body={id:element._id};
      const offerDeleted=await this.fetchDateService.httpPost(this.BackendUrls.URLs.deleteOffer,body);
      this.allOffers.splice(index);
    } catch (error) {
      
    }
    
  }


  async EditOffer(data:any){
    data.startDate=data.startDate.split('T')[0];
    data.endDate=data.endDate.split('T')[0];
    console.log('data is ',data.startDate);
    this.OfferForm.patchValue(data);
    this.CouponRequest=true;
  }


}
