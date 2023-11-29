import { Injectable } from '@angular/core';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../shared/services/cart.service';
declare let Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  publicKey: any;
  stripe: any;
  orderID: any = ''
  private secureNavbar = new BehaviorSubject(false);
  secureNavbar$ = this.secureNavbar.asObservable();
  StripePaymentOpen = new BehaviorSubject<boolean>(false);
  // StripePaymentOpen$ = this.StripePaymentOpen.asObservable();

  public orderId: string | null = null;

  loadStripe = new BehaviorSubject<Boolean>(false);

  constructor(
    private backendUri: UtilsModule,
    private fetchData: FetchDataService,
    private cartService: CartService,
    private router: Router
  ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/cart/billing') {

          this.secureNavbar.next(true);
        }
        else {
          this.secureNavbar.next(false);
        }
      }
    })
  }

  private stripeScript!: HTMLScriptElement | undefined;

  loadStripeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.stripeScript) {
        resolve();
      } else {
        this.stripeScript = document.createElement('script');
        this.stripeScript.src = 'https://js.stripe.com/v3/';
        this.stripeScript.onload = (event: Event) => resolve();
        this.stripeScript.onerror = reject;
        document.body.appendChild(this.stripeScript);
      }
    });
  }

  getStripeInstance(publicKey: string): any {
    return Stripe(publicKey);
  }

  unloadStripeScript(): void {
    if (this?.stripeScript && this.stripeScript?.parentNode) {
      this.stripeScript.parentNode.removeChild(this.stripeScript);
    }
  }

  async showMessage(messageText: any) {
    const messageContainer = document.querySelector("#payment-message");
    if (messageContainer) {
      messageContainer.textContent = messageText;
      this.toggleMessageContainer(messageContainer);
    }
  }

  private toggleMessageContainer(messageContainer: any) {
    messageContainer.classList.remove("hidden");
    setTimeout(() => {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 2000);
  }

  setLoading = async (isLoading: boolean): Promise<void> => {
    const submitButton = document.querySelector("#submit") as HTMLButtonElement | null;
    const spinner = document.querySelector("#spinner") as HTMLElement | null;
    const buttonText = document.querySelector("#button-text") as HTMLElement | null;

    if (submitButton) submitButton.disabled = isLoading;

    this.toggleElementVisibility(spinner, isLoading);
    this.toggleElementVisibility(buttonText, !isLoading);
  };

  private toggleElementVisibility(element: HTMLElement | null, isVisible: boolean) {
    if (element) {
      if (isVisible) element.classList.remove("hidden");
      else element.classList.add("hidden");
    }
  };

  async checkOrderStatus(clientSecret: any): Promise<void> {
    try {
      const response = await fetch(this.backendUri.URLs.getPaymentKeys);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const publicKey = data[0]?.keys[0]?.publicKey;

      this.stripe = Stripe(publicKey);
      // this.fetchData.HTTPGET(this.backendUri.URLs.getClientSecret).subscribe(async (res) => {
      //   console.log(res, 'res is');
      //   this.SecretClient = res;
      //   if (!this.SecretClient) return;

        
      // })
      
      const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);
      this.handlePaymentIntentStatus(paymentIntent);

    } catch (error) {
      console.error('Error checking order status:', error);
    }
  }

  private async handlePaymentIntentStatus(paymentIntent: any) {
    switch (paymentIntent.status) {
      case "succeeded":
        await this.updateOrderStatus(paymentIntent);
        // await this.sendInvoiceData(paymentIntent);
        break;

      // case "processing":
      //   break;
      // case "requires_payment_method":
      //   break;
    }
  }

  private async updateOrderStatus(paymentIntent: any) {



    let body: any = {};
    body = {
      newPaymentStatus: 'success',
      transactionId: paymentIntent.id,
      MOP: paymentIntent.payment_method_types[0],
      orderID: this.orderID
    };
    this.fetchData.HTTPPOST(this.backendUri.URLs.updateOrderStatus, body).subscribe();
  }

  // private async sendInvoiceData(paymentIntent: any) {
  //   await fetch('http://localhost:1000/invoiceSend', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(paymentIntent)
  //   })
  //     .then(response => {
  //       if (response.ok) return response.json();
  //       throw new Error('Network response was not ok.');
  //     })
  // }

  //  ADDRESS
  addressSelected: any = null;

  // CreateOrderClicked=new BehaviorSubject(false);
  // createOrderClicked$=this.CreateOrderClicked.asObservable();



}
