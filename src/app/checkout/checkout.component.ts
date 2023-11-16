import { Component, HostListener, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { CookieService } from 'ngx-cookie-service';
import { BillingResponseService } from './billing-response.service';
// import { StripPaymentService } from '../shared/services/stripe-Integration/strip-payment.service';
import { CheckoutService } from './checkout.service';
import { LoginCheckService } from '../shared/services/login-check.service';
import { retry } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // CouponAppliedBtnClicked:any='hidden';
  navbar_scroll_style: boolean = false;
  cartCount: number = 0;
  // OpenCoupon: boolean = false;
  AllCoupons: any;
  updateBoolean: boolean = false;
  cart: any = {};
  ParenClosed: boolean = false;

  direction: string = 'right';
  show: boolean = false;
  loading: boolean = false;

  @ViewChild('CouponCode') CouponCode: any;
  @ViewChild('Proceed__btn') Proceed__btn!: ElementRef;

  BillingPageVisited: boolean = false;
  constructor(private cartService: CartService, private loginCheckService: LoginCheckService, private cookie: CookieService, private billingService: BillingResponseService, private router: Router, private renderer: Renderer2, private toastService: ToastService, private BackendUrl: UtilsModule, private fetchService: FetchDataService, private route: Router, private el: ElementRef, private stripePay: CheckoutService) {
    // route changes
    this.router.events.subscribe((event) => {
      if (this.router.url === '/cart/billing') {
        this.BillingPageVisited = true;
      } else {
        this.BillingPageVisited = false;
      }
    });

    this.billingService.BillingpageVisited$.subscribe((data: any) => {
      this.BillingPageVisited = data;
    })

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

    this.fetchService.HTTPGET(this.BackendUrl.URLs.getCoupons).subscribe((data: any) => {
      this.AllCoupons = data;
      this.loading = false;
    });



  }



  ParentClosedFun(event: any) {
    this.ParenClosed = event;
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




// COUPONS CODE STARTS
CouponValid: string = 'hidden';
CouponApplied: any = '';
CouponOpener() {
  this.show = true;
}

InputChange() {
  this.CouponValid = '';
}


RemoveAppliedCoupon() {
  this.CouponApplied = false;
  this.cart.amounts.savings = 0;
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
      calculatedDiscount <= coupon.maximumDiscount ? calculatedDiscount : coupon.maximumDiscount;
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
          this.toastService.errorToast({ title: 'Coupon', body: `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
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
    this.toastService.errorToast({ title: 'Coupon', body: `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
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

  this.CouponCode.nativeElement.value = ''; // change input field to ''
  this.cart.amounts.savings = this.CalculateDiscount(this.CouponApplied);
  this.cart.amounts.total -= this.cart.amounts.savings;
  this.ParenClosed = true;
}


  async verifyOrderSummary() {
    this.cartService.fetchCart().subscribe(async (res) => {
      let result = JSON.parse(JSON.stringify(res));
      if (this.CouponApplied) {
        result.CouponApplied = this.CouponApplied;
      }

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

    });
  }

  ChangeHanlder(event: any) {
    this.show = event;
    this.CouponCode.nativeElement.value='';
  }
  
  // COUPONS CODE FINSIH

  async ProceedToPayment() {


    if (!this.billingService.Address) {
      this.toastService.errorToast({ title: 'Please select Address' });
      return;
    }

    // response of payment here 
    console.log("proceed to payment called")

    const paymentButton = document.getElementById('submit') as HTMLButtonElement;
    const razorpayButton = document.getElementById('razorSubmit') as HTMLButtonElement;
    if (paymentButton) {
      paymentButton.click();
    }

    if (razorpayButton) {
      razorpayButton.click();
    }


    this.billingService.PaymentResponse$.subscribe((data) => {
      console.log('data coming is ', data);

    })

    console.log(this.billingService.Address);
    this.cartService.fetchCart().subscribe((data) => {
      console.log('data coming is davin ', data);
      let body: any = {};
      if (this.CouponApplied) {
        body.coupon = this.CouponApplied;
        body.discount = data.amounts.savings;
      }
      body.products = data.details;
      body.address = this.billingService.Address;
      // body.payment_status = "succeeded"


      this.fetchService.HTTPPOST(this.BackendUrl.URLs.createOrder, body).subscribe((data: any) => {
        console.log('daa coming is ', data);
      });
    })

    console.log("its working")

    // const paymentButton = document.getElementById('submit') as HTMLButtonElement;
    //   if (paymentButton) {
    //     paymentButton.click(); 
    //   }
  }



}