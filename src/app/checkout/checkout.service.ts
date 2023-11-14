import { Injectable } from '@angular/core';
import { UtilsModule } from '../utils/utils.module';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from '../shared/services/fetch-data.service';
declare var Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  publicKey: any;
  stripe: any;

  constructor(
    private backendUri: UtilsModule,
    private fetchData: FetchDataService,
    private cookie: CookieService
  ) {}

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

  async checkOrderStatus(): Promise<void> {
    try {
      const response = await fetch(this.backendUri.URLs.getPaymentKeys);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const publicKey = data[0]?.keys[0]?.publicKey;

      this.stripe = Stripe(publicKey);
      console.log("response is public key ", publicKey);

      const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
      if (!clientSecret) return;

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
        await this.sendInvoiceData(paymentIntent);
        console.log("Payment succeeded. Payment Intent Status:", paymentIntent);
        break;
      case "processing":
        console.log("Payment is processing. Payment Intent Status:", paymentIntent.status);
        break;
      case "requires_payment_method":
        console.log("Payment requires a valid payment method. Payment Intent Status:", paymentIntent.status);
        break;
      default:
        console.log("An unexpected error occurred. Payment Intent Status:", paymentIntent.status);
        break;
    }
  }

  private async updateOrderStatus(paymentIntent: any) {
    const body: any = {
      buyerId: this.cookie.get('userToken'),
      newPaymentStatus: 'success',
      transactionId: paymentIntent.id,
      MOP: paymentIntent.payment_method_types[0],
    };

    await this.fetchData.HTTPPOST(this.backendUri.URLs.updateOrderStatus, body)
      .subscribe((data: any) => console.log('status updated ', data));
  }

  private async sendInvoiceData(paymentIntent: any) {
    await fetch('http://localhost:1000/invoiceSend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentIntent)
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log("Invoice data sent:", data);
    })
    .catch(error => {
      console.error("Error sending invoice data:", error);
    });
  }
}
