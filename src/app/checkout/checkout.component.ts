import { Component, HostListener, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { CheckoutService } from './checkout.service';
import { LoginCheckService } from '../shared/services/login-check.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // orderId send to service 
  // private _orderIDSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  // public readonly orderID$ = this._orderIDSubject.asObservable();
  // public updateOrderId(orderId: string) {
  //   this._orderIDSubject.next(orderId);
  // }

  LoginUser:boolean=false;
  loadRazorpayScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    this.renderer.appendChild(document.body, script);
  }

  // CouponAppliedBtnClicked:any='hidden';
  navbar_scroll_style: boolean = false;
  cartCount: number = 0;
  updateBoolean: boolean = false;
  cart: any = {};
  StripePaymentOpener: boolean = false;
  loading: boolean = false;
  @ViewChild('CouponCode') CouponCode: any;

  constructor(private cartService: CartService, private loginCheckService: LoginCheckService, private checkOutService: CheckoutService, private router: Router, private renderer: Renderer2, private toastService: ToastService, private BackendUrl: UtilsModule, private fetchService: FetchDataService, private route: Router, private el: ElementRef, private stripePay: CheckoutService) {
    this.checkOutService.secureNavbar$.subscribe((data) => {
      this.SecureNavBar = data;
    })
    this.checkOutService.StripePaymentOpen$.subscribe((data) => {
      console.log('data inside constructor is---------> ',data);
      
      this.StripePaymentOpener = data;
    })

    this.loginCheckService.getUser().subscribe((checkToken)=>{
      this.LoginUser=checkToken;
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
      this.verifyOrderSummary(false);
    });
    this.loadRazorpayScript();

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
  SecureNavBar: Boolean = false;
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
      return coupon.discountAmount < totalAmount ? coupon.discountAmount : 0;
    }
    else {
      if (coupon.discountType == 'percentage') {
        let calculatedDiscount = (totalAmount / 100) * coupon.discountAmount;
        calculatedDiscount = calculatedDiscount <= coupon.maximumDiscount ? calculatedDiscount : coupon.maximumDiscount;
        return calculatedDiscount < totalAmount ? calculatedDiscount : 0;
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

    if (!this.CheckMinimumPurchase(this.CouponApplied)) {
      this.toastService.errorToast({ title:  `minimum purchase amount is ${coupon.minimumPurchaseAmount}` });
      this.CouponValid='invalid';
      this.CouponApplied=null;
      this.show=false;
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





   verifyOrderSummary(navigate: boolean = true) {
      let res=this.cart;
      if(res?.details?.length==0) return;
      let result = JSON.parse(JSON.stringify(res));
    
      if (result.length == 0) return;
      if (this.CouponApplied) {
        result.CouponApplied = this.CouponApplied;
      }

      if (!navigate) {
        this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderWithoutCoupon, result).subscribe((response) => {
          this.cart.amounts = response;
        });
      }

      else {
          if (!this.LoginUser) {
            this.router.navigate(['/auth/login']);
          }
          else {
            this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderSummary, result).subscribe((response) => {
              this.cart.amounts = response;

              this.router.navigate(['/cart/billing']);
            });
          }

      }


  }

  ChangeHandler(event: any) {
    this.show = event;
    this.CouponCode.nativeElement.value = '';
  }


  AddressSelected: any = null;
  NextDisabled: boolean = false;

  nextClicked() {
    if (!this.checkOutService.addressSelected) {
      this.toastService.errorToast({ title: 'Please select some address' });
      return;
    }
    this.AddressSelected = this.checkOutService.addressSelected;
    if (this.AddressSelected) {
      this.NextDisabled = true;
    }
    if (this.checkOutService.addressSelected) {
      this.createOrder();
    }
  }


  OrderId: string = '';
  createOrder() {
    let body: any = {};
    body.address = this.AddressSelected;

    // this.cartService.fetchCart().subscribe((data) => {
      if (this.CouponApplied) {
        body.coupon = this.CouponApplied;
        body.discount = this.cart.amounts.savings;
      }
      body.products = this.cart.details;

      this.fetchService.HTTPPOST(this.BackendUrl.URLs.createOrder, body).subscribe((data: any) => {
        this.checkOutService.loadStripe.next(true);
        this.checkOutService.StripePaymentEmitter(true);
        this.checkOutService.orderID = data.orderId;
      });


      this.NextDisabled = false;
    // })
  }

  // COUPONS CODE FINSIH-------------------

  async ProceedToPayment() {
    let body: any = {};
    body.address = this.AddressSelected;

    // if(!body.address){
    //   this.toastService.errorToast({title:'Please select some address'});
    //   return;
    // }


    // response of payment here 
    const paymentButton = document.getElementById('submit') as HTMLButtonElement;
    const razorpayButton = document.getElementById('razorSubmit') as HTMLButtonElement;
    const loadStripeElements = document.getElementById('loadStripeElements') as HTMLButtonElement;
    if(loadStripeElements) {
      loadStripeElements.click();
    }

    if (paymentButton) {
      paymentButton.click();
    }

    if (razorpayButton) {
      razorpayButton.click();
    }

  }
}