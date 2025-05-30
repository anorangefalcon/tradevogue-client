import { Injectable } from '@angular/core';
import { UtilsModule } from '../utils/backend-urls';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartService } from '../shared/services/cart.service';
declare let Stripe: any;

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  publicKey: any;
  stripe: any;
  orderID: any = '';
  secureNavbar = new BehaviorSubject(false);
  PaymentSuccess = new BehaviorSubject(false);

  FinalPaymentAmount = new BehaviorSubject<any>(false);

  ProceedToPayment = new BehaviorSubject(false);
  //  ADDRESS
  //  addressSelected = new BehaviorSubject<any>(false);
  addressSelected: any = null;
  secureNavbar$ = this.secureNavbar.asObservable();
  public orderId: string | null = null;

  loadStripe = new BehaviorSubject<Boolean>(false);
  allSubscriptions: Subscription[] = [];

  constructor(
    private backendUri: UtilsModule,
    private fetchDataService: FetchDataService,
    private router: Router,
    private cartService: CartService
  ) {
    this.allSubscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (this.router.url === '/cart/billing') {
            this.secureNavbar.next(true);
          } else {
            this.secureNavbar.next(false);
          }
        }
      })
    );
  }

  private stripeScript!: HTMLScriptElement | undefined;

  unloadStripeScript(): void {
    if (this?.stripeScript && this.stripeScript?.parentNode) {
      this.stripeScript.parentNode.removeChild(this.stripeScript);
    }
  }

  async checkOrderStatus(clientSecret: any): Promise<void> {
    this.fetchDataService
      .HTTPGET(this.backendUri.URLs.getPaymentKeys)
      .subscribe({
        next: async (response: any) => {
          console.log('response is ', response);

          const publicKey = response[0].decryptedPublicKey;
          this.stripe = Stripe(publicKey);
          const { paymentIntent } = await this.stripe.retrievePaymentIntent(
            clientSecret
          );
          this.handlePaymentIntentStatus(paymentIntent);
        },
        error: () => {},
      });
  }

  private handlePaymentIntentStatus(paymentIntent: any) {
    console.log('paymentIntent is ', paymentIntent);
    if (paymentIntent.status == 'succeeded') {
      // this.updateOrderStatus();
      this.cartService.clearCart();
      this.PaymentSuccess.next(true);
      this.ProceedToPayment.next(false);
    }
  }
  //  ADDRESS
  // addressSelected: any = null;
}
