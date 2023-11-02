import { Component, HostListener, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from '../shared/services/cart.service';

import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  showMore: boolean = false;
  CouponValid: string = 'hidden';
  CouponApplied: any = '';
  // CouponAppliedBtnClicked:any='hidden';
  navbar_scroll_style: boolean = false;
  cartCount: number = 0;
  OpenCoupon: boolean = false;
  AllCoupons: any;
  updateBoolean: boolean = false;
  cart: any = {};
  ParenClosed: boolean = false;

  direction: string = 'right';
  show: boolean = false;

  @ViewChild('CouponCode') CouponCode: any;
  @ViewChild('Proceed__btn') Proceed__btn!: ElementRef;

  BillingPageVisited: boolean = false;
  constructor(private cartService: CartService, private cookie:CookieService, private router: Router, private renderer: Renderer2, private toastService: ToastService, private BackendUrl: UtilsModule, private fetchService: FetchDataService, private route: Router, private el: ElementRef) {

    // if(this.route.url=='/cart/billing'){
    //   // this.BillingPageVisited=true;
    // }

    // console.log('result is ',this.cookieService.get('CouponApplied'));
    
    // if(!this.cookieService.get('CouponApplied')){
    //   this.CouponApplied=this.cookieService.get('CouponApplied');
    // }





  //  this.cookieService.get('DeliveryAddress');

    // (this.userService.PaymentUrlVisited.subscribe((data)=>{
    //   this.BillingPageVisited=data;
    // }))

  }

  async ngOnInit() {
    this.cartService.fetchCart('count').subscribe((data) => {
      this.cartCount = data;
    });

    this.cartService.fetchCart().subscribe((data) => {
      this.cart = data;
    });

    this.fetchService.HTTPGET(this.BackendUrl.URLs.getCoupons).subscribe((data:any)=>{
      this.AllCoupons=data;
    });
 


  }

  ChangeHanlder(event: any) {
    this.show = event;
  }

  ParentClosedFun(event: any) {
    this.ParenClosed = event;
  }

  DateParser(el: any) {
    // console.log('el is ',(new Date(el).toDateString()).split(' ').splice(0,1));
    let date: any = (new Date(el).toDateString()).split(' ');
    date.splice(0, 1)
    date = String(date[0] + ' ' + date[1] + ', ' + date[2]);
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


    // cookieExists == true ? this.updateBoolean = false : this.updateBoolean = true;

    if (!cookieExists) {
      // this.redirectToLogin();
      this.route.navigate(['/cart/billing']);

    } else {

      this.route.navigate(['/cart/billing']);
    }
  }





  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }



  RemoveAppliedCoupon() {
    this.CouponApplied = false;
    this.cart.amounts.savings = 0;
    this.cart.amounts.total = this.cart.amounts.subTotal;
  }

  CloseCouponDialog() {
    this.OpenCoupon = false;
  }

  CheckMinimumPurchase(coupon: any) {
    return coupon.minimumPurchaseAmount < this.cart.amounts.total;

  }

  CalculateDiscount(coupon: any) {

    let totalAmount = (this.cart.amounts.total);
    if (coupon.discountType == 'flat') {
      return coupon.discountAmount <= coupon.maximumDiscount ? coupon.discountAmount : coupon.maximumDiscount;
    }
    else {
      if (coupon.discountType == 'percentage' && coupon.DiscountPercentageType == 'fixed') {
        let calculatedDiscount = (totalAmount / 100) * coupon.discountAmount;
        return calculatedDiscount <= coupon.maximumDiscount ? calculatedDiscount : coupon.maximumDiscount;
      }

    }

  }

 async ApplyCoupon(coupon: any = '', event: any = '') {
    if (event) {
      let value = this.CouponCode.nativeElement.value;

      for (let coupon of this.AllCoupons) {
        if (coupon.couponcode == value) {
          if (!this.CheckMinimumPurchase(coupon)) {
            this.toastService.errorToast({ title: 'Coupon', body: `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
            this.OpenCoupon = false;
            return;
          }
          this.CouponApplied = coupon;
          // await this.userService.couponApplied.next(this.CouponApplied);
          // this.cookieService.set('CouponApplied',JSON.stringify(this.CouponApplied));
          this.CouponValid = 'valid';
          break;
        }
      }
      if (this.CouponValid != 'valid') {
        this.CouponValid = 'invalid';
        return;
      }
      // this.ParenClosed;
    }

    else {
      if (!this.CheckMinimumPurchase(coupon)) {
        this.toastService.errorToast({ title: 'Coupon', body: `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
        this.OpenCoupon = false;
        return;
      }
      this.CouponApplied = coupon;
      // await this.userService.emittingValue('couponApplied',this.CouponApplied);
      // this.cookieService.set('CouponApplied',JSON.stringify(this.CouponApplied));
      this.CouponValid = 'valid';
      
      // this.ParenClosed=true;
    }

    if(this.CouponValid == 'valid'){
      this.toastService.successToast({
        title: 'Coupon applied successfully'
      })
    }
    else if(this.CouponValid == 'invalid'){
      this.toastService.errorToast({
        title: 'Coupon not valid'
      })
    }
    this.CouponCode.nativeElement.value = ''; // change input field to ''
    this.cart.amounts.savings = this.CalculateDiscount(coupon);
    // this.cookieService.set('coupon',this.CalculateDiscount(coupon));
    this.cart.amounts.total -= this.cart.amounts.savings;
    // this.cookieService.set('total',this.cart.amounts.total);
    this.ParenClosed = true;
  }

  InputChange() {
    this.CouponValid = 'hidden';
  }


  CouponOpener() {
    this.show = true;
  }


  // cartArr: any[] = [];
  GetProducts() {
    return new Promise((res, rej) => {
      this.cartService.fetchCart("details").subscribe((data) => {
        res(data);
      });

    })

  }



  async verifyOrderSummary() { 
    
      this.cartService.fetchCart().subscribe(async (res) => {
        console.log('res is ',res);
        
        let result = JSON.parse(JSON.stringify(res));
        if (this.CouponApplied) {
          result.CouponApplied = this.CouponApplied;
        }

         this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderSummary, result).subscribe((response)=>{
          console.log('response is ',response);
          
          this.cart.amounts = response;

          const checkToken = this.cookie.get('userToken');
          console.log('token find is ',checkToken);
          if (!checkToken) {
            this.router.navigate(['/auth/login']);
          }
          else {
            this.router.navigate(['/cart/billing']);
          }
        });
        
       });

    
  }


 async ProceedToPayment() {
  

  // this.userService.ordersubject$.subscribe((data:any)=>{
  //   // console.log('data ---------> ',data);
    
  // });

  // return;

  //       (this.userService.SelectedAddress$).subscribe((address)=>{
  //         if(!address) this.toastService.errorToast({title:'Please select Address'});
  //         this.cartService.fetchCart().subscribe((res) => {
  //           let input=JSON.parse(JSON.stringify(res));
  //           // console.log('input amount is ',input.amounts);
  //           // this.userService.PaymentSubject.next(input.amounts);

  //           // this.userService.Payment$.subscribe((data)=>{

  //           // })

  //           // return;
  //           // input.DeliveredAddress=address;            
  //           let data:any={};
  //           if(this.CouponApplied){
  //             data.coupon=this.CouponApplied;
  //             data.discount=input.amounts.savings;
  //           }
  //           data.address=address;
  //           data.products=input.details;
  //           this.fetchService.HTTPPOST(this.BackendUrl.URLs.createOrder,data).subscribe((data:any)=>{

  //           });

  //         })
  //       });
          
        
  //         return;
  // }

  
}

}