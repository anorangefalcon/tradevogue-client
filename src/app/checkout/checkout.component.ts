import { Component, HostListener, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { CheckoutService } from './checkout.service';
import { LoginCheckService } from '../shared/services/login-check.service';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  LoginUser: boolean = false;
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
  CheckOutDisabled:boolean=false;
  loading: boolean = false;
  isFormFilled = false;
  paymentButton = false;
  PaymentSuccess: boolean = false;
  theme: Boolean = false;
  @ViewChild('CouponCode') CouponCode: any;

  allSubscriptions: Subscription[] = [];
  addressSelected: any = null;
  ProceedToPaymentClicked:boolean=false;
  constructor(private cartService: CartService,
    private loginCheckService: LoginCheckService,
    private checkOutService: CheckoutService,
    private router: Router,
    private renderer: Renderer2,
    private toastService: ToastService,
    private BackendUrl: UtilsModule,
    private fetchService: FetchDataService,
    private route: Router,
    private el: ElementRef,
    private stripePay: CheckoutService)
     {
      this.fetchService.themeColor$.subscribe((color)=>{
        this.theme = color;
      })
    this.allSubscriptions.push(
      this.checkOutService.secureNavbar$.subscribe((data) => {
        this.SecureNavBar = data;
      }));

    this.allSubscriptions.push(
      this.checkOutService.loadStripe.subscribe((data: any) => {
        // this.PaymentDisabled=false;
        this.StripePaymentOpener = data;
      }));

    this.allSubscriptions.push(
      this.loginCheckService.getUser().subscribe((checkToken) => {
        this.LoginUser = checkToken;
      }),
      this.checkOutService.ProceedToPayment.asObservable().subscribe((data)=>{
        console.log('data come up is ',data);
        
        this.ProceedToPaymentClicked=data;
       })
      );
  }

  async ngOnInit() {
    this.loading = true;
    let cartSub = this.cartService.fetchCart().subscribe((data) => {
      this.cartCount = data.details?.length;
      this.cart = data;
      if(this.cart?.details?.length>0){
        this.verifyOrderSummary(false);
      }
      this.loading = false;
    })
    this.allSubscriptions.push(cartSub);
    this.loadRazorpayScript();

    this.checkOutService.PaymentSuccess.asObservable().subscribe((data) => {
      this.PaymentSuccess = data;
    })
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
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

  // COUPONS CODE STARTS-------------------
  CouponValid: string = '';
  AllCoupons: any=[];
  SecureNavBar: Boolean = false;
  CouponApplied: any = '';
  direction: string = 'right';
  show: boolean = false;

  CouponOpener() {
    this.allSubscriptions.push(
      this.fetchService.HTTPGET(this.BackendUrl.URLs.getCoupons).subscribe((data: any) => {
        this.AllCoupons = data;
        this.show = true;
      }));
  }

  InputChange(event:any) {
   if(!this.CouponCode.nativeElement.value){
    this.CouponValid='';
    return;
   }
    this.CouponValid = 'valid';
  }


  RemoveAppliedCoupon() {
    this.cart.amounts.discount=null;
    this.CouponApplied=false; 
  }


  CheckMinimumPurchase(coupon: any) {
    return coupon?.minimumPurchaseAmount < this.cart.amounts.total;
  }



  CalculateDiscount(coupon: any) {
    const totalAmount = this.cart.amounts.total;
  
    if (coupon.discountType === 'flat') {
      return Math.min(coupon.discountAmount, totalAmount);
    } else if (coupon.discountType === 'percentage') {
      const calculatedDiscount = (totalAmount / 100) * coupon.discountAmount;
      const cappedDiscount = Math.min(calculatedDiscount, coupon.maximumDiscount);
      return Math.min(cappedDiscount, totalAmount);
    }
  
    return 0;
  }
  
 

  async ApplyCoupon(coupon: any = '', event: any = '') {
    let value = (event ? this.CouponCode.nativeElement.value.trim() : coupon.couponcode.trim());
  
    if (event) {
      const foundCoupon = this.AllCoupons.find((c:any) => c.couponcode === value);
      if (foundCoupon) {
        this.CouponApplied = foundCoupon;
        this.CouponValid = 'valid';
      } else {
        this.CouponValid = 'invalid';
        return;
      }
    } else {
      this.CouponApplied = coupon;
      this.CouponValid = 'valid';
    }
  
    if (!this.CheckMinimumPurchase(this.CouponApplied)) {
      this.toastService.errorToast({ title: `minimum purchase amount is ${this.CouponApplied.minimumPurchaseAmount}` });
      this.CouponValid = 'invalid';
      this.CouponApplied = null;
      this.show = false;
      return;
    }
  
    if (this.CouponValid == 'valid') {
      this.toastService.successToast({ title: 'Coupon applied successfully' });
    } else if (this.CouponValid == 'invalid') {
      this.toastService.errorToast({ title: 'Coupon not valid' });
      return;
    }
  
    this.CouponCode.nativeElement.value = '';
    this.cart.amounts.discount = this.CalculateDiscount(this.CouponApplied);
    // this.cart.amounts.total -= this.cart.amounts.discount;
    this.show = false;
  }
  

  verifyOrderSummary(navigate: boolean = true) {
    if (this.cart?.details?.length == 0) return;
    let body:any={products: this.cart.details};

    if (this.CouponApplied) {
      body.couponId = this.CouponApplied._id;
    }

    if (!navigate) {
      this.allSubscriptions.push(
        this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderWithoutCoupon,  body).subscribe((response) => { 
       
          this.cart.amounts =JSON.parse(JSON.stringify(response));
        }));
    }

    else {
      this.CheckOutDisabled=true;
      if (!this.LoginUser) {
        this.CheckOutDisabled=false;
        this.router.navigate(['/auth/login']);
      }
      else {
        this.allSubscriptions.push(
          this.fetchService.HTTPPOST(this.BackendUrl.URLs.verifyOrderSummary, body).subscribe({
            next:(response) => {
            this.cart.amounts =JSON.parse(JSON.stringify(response));
              this.checkOutService.FinalPaymentAmount.next(response);
            this.router.navigate(['/cart/billing']);
            this.CheckOutDisabled=false;
          },
          error:(error)=>{
            this.CheckOutDisabled=false;
          }
        }));
          
        
      }
    }
  }

  // OrderCompleted(){
  //   this.checkOutService.addressSelected=null;
  // }

  ChangeHandler(event: boolean) {
    this.show = event;
    if(!this.CouponCode)return;
    this.CouponCode.nativeElement.value = '';
    this.CouponValid='';
  }

  AddressSelected: any = null;
  NextDisabled: boolean = false;

  nextClicked() {
    if (!this.checkOutService.addressSelected) {
      this.toastService.errorToast({ title: 'Please select some address' });
      return;
    }
      this.createOrder();
  }

  OrderId: string = '';
  createOrder() {
    let body: any = {};
  this.AddressSelected;
  this.NextDisabled=true;
    if (this.CouponApplied) {
      body.couponId = this.CouponApplied._id;
    }
    body.products = this.cart.details;
    body.address=this.AddressSelected;
    this.allSubscriptions.push(
      this.fetchService.HTTPPOST(this.BackendUrl.URLs.createOrder, body).subscribe(

        {next:
        (data: any) => {
        this.checkOutService.loadStripe.next(true);
        this.checkOutService.orderID = data.orderId;
        this.NextDisabled = false;
      },
      error:(error)=>{
        this.NextDisabled = false;
      }
    }
      )
      );
   
  }

  // COUPONS CODE FINSIH-------------------

  async ProceedToPayment() {
    let body: any = {};
    body.address = this.AddressSelected;
    // response of payment here 
    const paymentButton = document.getElementById('submit') as HTMLButtonElement;
    const razorpayButton = document.getElementById('razorSubmit') as HTMLButtonElement;

    if (paymentButton) {
      paymentButton.click();
    }

    if (razorpayButton) {
      razorpayButton.click();
    }

  }


  isPaymentFormFilled(): boolean {
    const paymentForm = document.getElementById('payment-form') as HTMLFormElement;

    const isFilled = paymentForm && paymentForm.checkValidity();

    return isFilled;
  }

}