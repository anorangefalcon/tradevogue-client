import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { UserServiceService } from '../shared/services/user-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  showMore : boolean = false;
  CouponValid:string='hidden';
  CouponApplied:any='';
  // CouponAppliedBtnClicked:any='hidden';
  navbar_scroll_style: boolean = false;
  cartCount: number = 0;
  OpenCoupon:boolean=false;
  AllCoupons:any;
  updateBoolean: boolean = false;
  cart: any = {};

  @ViewChild('CouponCode') CouponCode:any; 
  constructor(private cartService: CartService,private userService:UserServiceService,private toastService:ToastService,private BackendUrl:UtilsModule,private fetchService:FetchDataService, private cookie: CookieService, private route: Router, private el: ElementRef) { }

 async ngOnInit() {
    this.cartService.fetchCart("count").subscribe((data) => {
      this.cartCount = data;
    });
    this.cartService.fetchCart().subscribe((data) => {
      this.cart = data;
    });

    this.AllCoupons=await this.fetchService.httpGet(this.BackendUrl.URLs.getCoupons);
    // console.log('data is-------------- ',this.AllCoupons);
    

  }


  DateParser(el:any){
    // console.log('el is ',(new Date(el).toDateString()).split(' ').splice(0,1));
    let date:any=(new Date(el).toDateString()).split(' ');
    date.splice(0,1)
    date=String(date[0]+ ' '+date[1]+', '+date[2]);
    return date;
  }

  redirectToLogin() {
    const returnUrl = '/cart/billing';
    this.route.navigate(['/auth/login'], { queryParams: { returnUrl } });
  }

  scrollToOrders() {
    const orders = this.el.nativeElement.querySelector('#orders')
    if (orders) {
      orders.scrollIntoView(
        {
          block: 'start',
          behavior: 'smooth'
        });
    }
  }
  checkLogin() {
    const cookieExists = document.cookie.indexOf('loginDetails') !== -1;
    console.log(cookieExists);

    // cookieExists == true ? this.updateBoolean = false : this.updateBoolean = true;

    if (!cookieExists) {
      // this.redirectToLogin();
      this.route.navigate(['/cart/billing']).then(() => {

      
        console.log("CART IS  ",this.cart)
        window.location.reload();
      });
      
    } else {
      
      this.route.navigate(['/cart/billing']).then(() => {

      
        console.log("CART IS  ",this.cart)
        window.location.reload();
      });
  }
}





  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }

  

  RemoveAppliedCoupon(){
    this.CouponApplied=false;
  this.cart.amounts.savings=0;
  }

  CloseCouponDialog(){
    this.OpenCoupon=false;
  }

  CheckMinimumPurchase(coupon:any){
    console.log('result is ',this.cart.amounts.total);
    
    return coupon.minimumPurchaseAmount<this.cart.amounts.total;
   
  }

  CalculateDiscount(coupon:any){
    // if(cart.amounts.savings)
    let totalAmount=(this.cart.amounts.total);
    // if(coupon.)
    if(coupon.discountType=='flat'){
      return coupon.discountAmount;
    }
    else{
      if(coupon.discountType=='percentage' && coupon.DiscountPercentageType=='fixed'){
        // console.log('result is ',((totalAmount/100))*coupon.discountAmount);
        
        return (totalAmount/100)*coupon.discountAmount; 
      }
      else{
        const discountPercentage = Math.floor(Math.random() * coupon.discountAmount);
        return (totalAmount/100)*coupon.discountPercentage; 
      }
    }

  }

  ApplyCoupon(coupon:any='',event:any=''){  
    if(event){
      let value =  this.CouponCode.nativeElement.value;
      for(let coupon of this.AllCoupons){
        if(coupon.couponcode==value){
          if(!this.CheckMinimumPurchase(coupon)){
            this.toastService.errorToast({title:'Coupon',body:`minimum purchase amount is ${coupon.minimumPurchaseAmount}`});
            this.OpenCoupon=false;
            return;
          }
          this.CouponApplied=coupon;
          this.CouponValid='valid';
          break;
        }   
      }
      if(this.CouponValid!='valid'){
        this.CouponValid='invalid';
        return;
      } 

    }
    
    else{
      if(!this.CheckMinimumPurchase(coupon)){
        this.toastService.errorToast({title:'Coupon',body:`minimum purchase amount is ${coupon.minimumPurchaseAmount}`});
        this.OpenCoupon=false;
        return;
      }
      this.CouponApplied=coupon; 
      this.CouponValid='valid';
      
    
    }
    
    this.CouponCode.nativeElement.value = ' ';
    this.cart.amounts.savings=this.CalculateDiscount(coupon);
    this.OpenCoupon=false;
  }

  InputChange(){
    this.CouponValid='hidden';
  }


  CouponOpener(){
    this.OpenCoupon=true;
  }
  

  // cartArr: any[] = [];
  GetProducts(){
    return new Promise((res,rej)=>{
      this.cartService.fetchCart("details").subscribe((data) => {
          res(data);
        });
      
    })
   
  }

  // async CreateOrder(){  
  //   try {
  //     let products:any=await this.GetProducts();
  //       // console.log('data is------ ',data);
  //   //  this.userService.userDeliveredAddress$.subscribe(async (data:any)=>{
  //     // console.log('data coming is ',);
  //     let body:any={};
  //     console.log('couponApplied is ',this.CouponApplied);
      
  //     if(this.CouponApplied){
  //       body.couponCode=this.CouponApplied.couponcode;
  //       body.discount= this.cart.amounts.savings;
  //       console.log('BODY IS ',body);
        
  //     }

  //   products= products.map((element:any)=>{
       
  //       delete element.info;
  //       return element;
  //     });
    

  //     body.product=products;
  //     // body.address=data;
  //     //  body={product:products,address:data}; 
  //      console.log('body coming is ',body);
       
  //     let response=await this.fetchService.httpPost(this.BackendUrl.URLs.createOrder,body);
  //     console.log('response is ',response);
      
  //       });
        
       
      
  //   } catch (error) {
      
  //   }
  // }


}
