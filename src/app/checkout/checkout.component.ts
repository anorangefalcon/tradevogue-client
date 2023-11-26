import { Component, HostListener, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
// import { StripPaymentService } from '../shared/services/stripe-Integration/strip-payment.service';
import { CheckoutService } from './checkout.service';
import { LoginCheckService } from '../shared/services/login-check.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // CouponAppliedBtnClicked:any='hidden';
  navbar_scroll_style: boolean = false;
  cartCount: number = 0;
  updateBoolean: boolean = false;
  cart: any = {};

  loading: boolean = false;
  @ViewChild('CouponCode') CouponCode: any;

  constructor(private cartService: CartService, private loginCheckService: LoginCheckService, private checkOutService:CheckoutService, private router: Router, private renderer: Renderer2, private toastService: ToastService, private BackendUrl: UtilsModule, private fetchService: FetchDataService, private route: Router, private el: ElementRef, private stripePay: CheckoutService) {
    this.checkOutService.secureNavbar$.subscribe((data)=>{
      this.SecureNavBar=data;
    })
    this.checkOutService.StripePaymentOpen$.subscribe((data)=>{
      this.StripePaymentOpener=data;
    })

 this.verifyOrderSummary(false);

  }


  async ngOnInit() {
    this.loading = true;
    this.cartService.fetchCart('count').subscribe((data) => {
      this.cartCount = data;
    });

    this.cartService.fetchCart().subscribe((data) => {
      this.cart = data;
      this.loading = false;
    });

  }






  DateParser(el: any) {
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






  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }





 


  // cartArr: any[] = [];
  GetProducts() {
    return new Promise((res, rej) => {
      this.cartService.fetchCart("details").subscribe((data) => {
        res(data);
      });

    })

  }




// COUPONS CODE STARTS-------------------
CouponValid: string = 'hidden';
AllCoupons: any;
SecureNavBar:Boolean=false;
CouponApplied: any = '';
direction: string = 'right';
show: boolean = false;
CouponOpener() {
  this.fetchService.HTTPGET(this.BackendUrl.URLs.getCoupons).subscribe((data: any) => {
    this.AllCoupons = data;
    this.loading = false;
    this.show = true;
  });
}

InputChange() {
  this.CouponValid = '';
}


RemoveAppliedCoupon() {

  this.cart.amounts.savings -= this.CalculateDiscount(this.CouponApplied);
  this.CouponApplied = false;  
  this.cart.amounts.total = this.cart.amounts.subTotal;
}


CheckMinimumPurchase(coupon: any) {
  return coupon.minimumPurchaseAmount < this.cart.amounts.total;
}

CalculateDiscount(coupon: any) {
  let totalAmount = (this.cart.amounts.total);
  if (coupon.discountType == 'flat') {
    return coupon.discountAmount<totalAmount?coupon.discountAmount:0;
  }
  else {
    if (coupon.discountType == 'percentage') {
      let calculatedDiscount = (totalAmount / 100) * coupon.discountAmount;
    calculatedDiscount=  calculatedDiscount <= coupon.maximumDiscount ? calculatedDiscount : coupon.maximumDiscount;
      return calculatedDiscount<totalAmount?calculatedDiscount:0;
    }
  }
}

async ApplyCoupon(coupon: any = '', event: any = '') {
  if (event) {
    let value = this.CouponCode.nativeElement.value;
    for (let coupon of this.AllCoupons) {
      if (coupon.couponcode == value) {
        if (!this.CheckMinimumPurchase(coupon)) {
          this.toastService.errorToast({ title:`minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
          this.show=false;
          return;
        }
        this.CouponApplied = coupon;
        this.CouponValid = 'valid';
        break;
      }
    }
    if (this.CouponValid != 'valid') {
      this.CouponValid = 'invalid';
      return;
    }
  }

  else {
    this.CouponApplied = coupon;
    this.CouponValid = 'valid';
  }

  if (this.CouponApplied?.discountType=='percentage' && !this.CheckMinimumPurchase(this.CouponApplied)) {
    this.toastService.errorToast({ title: `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
    this.show=false;
    this.CouponApplied='';
    this.CouponValid = 'invalid';
    return;
  }

  
  if (this.CouponValid == 'valid') {
    this.toastService.successToast({
      title: 'Coupon applied successfully'
    })
  }
  else if (this.CouponValid == 'invalid') {
    this.toastService.errorToast({
      title: 'Coupon not valid'
    })
    return;
  }

  this.CouponCode.nativeElement.value = '';
  this.cart.amounts.savings += this.CalculateDiscount(this.CouponApplied);
  this.cart.amounts.total -= this.cart.amounts.savings;
  this.show = false;

}


  async verifyOrderSummary(navigate:Boolean=true) {
      this.cartService.fetchCart().subscribe(async (res) => {
        // if(res.details.length==0) return;
        if(!res?.details?.length) return;
        let result = JSON.parse(JSON.stringify(res));
        if (this.CouponApplied) {
          result.CouponApplied = this.CouponApplied;
        }
  
        if(!navigate){        
          this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderWithoutCoupon, result).subscribe((response) => {
            this.cart.amounts = response;
          });
        }
  
        else{
        this.loginCheckService.getUser().subscribe((checkToken) => {
          if (!checkToken) {
            this.router.navigate(['/auth/login']);
          }
          else {
            this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderSummary, result).subscribe((response) => {
              this.cart.amounts = response;
  
              this.router.navigate(['/cart/billing']);
            });
          }
  
        })
      }
  
      });


  }

  ChangeHanlder(event: any) {
    this.show = event;
    this.CouponCode.nativeElement.value='';
  }

  StripePaymentOpener:Boolean=false;
  AddressSelected:any=null;
  NextDisabled:Boolean=false;
  nextClicked(){
    
      if(!this.checkOutService.addressSelected){
        this.toastService.errorToast({title:'Please select some address'});
        return;
      }
      this.AddressSelected=this.checkOutService.addressSelected;
      if(this.AddressSelected){
        this.NextDisabled=true;
      }

    if(this.checkOutService.addressSelected){
      this.createOrder();
    }
  }


  OrderId:String='';
  async createOrder(){
    let body:any={};
    body.address=this.AddressSelected;
    await this.cartService.fetchCart().subscribe((data) => {
      if (this.CouponApplied) {
        body.coupon = this.CouponApplied;
        body.discount = data.amounts.savings;
      }
      body.products = data.details;

      this.fetchService.HTTPPOST(this.BackendUrl.URLs.createOrder, body).subscribe((data: any) => {
          this.checkOutService.StripePaymentOpen.next(true);
          this.checkOutService.orderID=data.orderId;
        });


        this.NextDisabled=false;
    })
  }

  // COUPONS CODE FINSIH-------------------

  async ProceedToPayment() {
    let body:any={};
    body.address=this.AddressSelected;
   body.coupon= this.CouponApplied;
    body.orderID=this.checkOutService.orderID;
    this.fetchService.HTTPPOST(this.BackendUrl.URLs.updateOrder, body).subscribe((data: any) => {
      // console.log(data);
      
    });

    return;

    // if(!body.address){
    //   this.toastService.errorToast({title:'Please select some address'});
    //   return;
    // }


    // response of payment here 
    const paymentButton = document.getElementById('submit') as HTMLButtonElement;
    const razorpayButton = document.getElementById('razorSubmit') as HTMLButtonElement;
    if (paymentButton) {
      paymentButton.click();
    }

    if (razorpayButton) {
      razorpayButton.click();
    }

    await this.cartService.fetchCart().subscribe((data) => {
      if (this.CouponApplied) {
        body.coupon = this.CouponApplied;
        body.discount = data.amounts.savings;
      }
      body.products = data.details;
      body.orderID=this.OrderId;
      this.fetchService.HTTPPOST(this.BackendUrl.URLs.updateOrder, body).subscribe((data: any) => {
        // console.log(data);
        
      });
    })
  }
}