import { Injectable } from '@angular/core';
declare var Stripe: any;
import { UtilsModule } from 'src/app/utils/utils.module';
import { CartService } from '../cart.service';
import { FetchDataService } from '../../../faq-page/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';
import { BillingResponseService } from 'src/app/checkout/billing-response.service';

@Injectable({
  providedIn: 'root'
})
export class StripPaymentService {
  publicKey: any;
  stripe: any;

  constructor(private backendUri: UtilsModule, private billingService: BillingResponseService, private CartService: CartService, private fetchData: FetchDataService, private cookie: CookieService) { }

  async showMessage(messageText: any) {
    const messageContainer = document.querySelector("#payment-message");

    if (messageContainer) {
      messageContainer.classList.remove("hidden");
      messageContainer.textContent = messageText;

      setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
      }, 2000);
    }
  }

  setLoading = async (isLoading: boolean): Promise<void> => {
    const submitButton = document.querySelector("#submit") as HTMLButtonElement | null;
    const spinner = document.querySelector("#spinner");
    const buttonText = document.querySelector("#button-text");

    if (submitButton) {
      submitButton.disabled = isLoading;
    }

    if (spinner) {
      if (isLoading) {
        spinner.classList.remove("hidden");
      } else {
        spinner.classList.add("hidden");
      }
    }

    if (buttonText) {
      if (isLoading) {
        buttonText.classList.add("hidden");
      } else {
        buttonText.classList.remove("hidden");
      }
    }
  };

  async checkOrderStatus(): Promise<void> {
    const response = await fetch(this.backendUri.URLs.getPaymentKeys);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const publicKey = data[0]?.keys[0]?.publicKey;

    this.stripe = Stripe(publicKey);



    console.log("response is public key ", publicKey);

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );


    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case "succeeded":
        // this.showMessage("Payment succeeded!");
        let body: any = {
          buyerId: this.cookie.get('userToken'),
          newPaymentStatus: 'success',
          transactionId: paymentIntent.id,
          MOP: paymentIntent.payment_method_types[0],
        };

        // this.billingService.PaymentResponse.next(true);


        this.fetchData.HTTPPOST(this.backendUri.URLs.updateOrderStatus, body).subscribe((data: any) => {
          console.log('status updated ', data);
        });


        body.payment_status = "succeeded"

        console.log("submiting user token is ", this.cookie.get('userToken'));

        // this.fetchData.HTTPPOST(this.backendUri.URLs.createOrder,body).subscribe((data:any)=>{
        //   console.log('daa coming is ',data);                 
        // });

        await fetch('http://localhost:1000/invoiceSend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentIntent)
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log("Invoice data sent:", data);
          })
          .catch(error => {
            console.error("Error sending invoice data:", error);
          });


        console.log("Payment succeeded. Payment Intent Status:", paymentIntent);
        break;
      case "processing":
        // this.showMessage("Your payment is processing.");
        console.log("Payment is processing. Payment Intent Status:", paymentIntent.status);
        break;
      case "requires_payment_method":
        // this.showMessage("Your payment was not successful, please try again.");
        console.log("Payment requires a valid payment method. Payment Intent Status:", paymentIntent.status);
        break;
      default:
        // this.showMessage("Something went wrong.");
        console.log("An unexpected error occurred. Payment Intent Status:", paymentIntent.status);
        break;
    }
  }



  
  async checkStatus(stripe: any): Promise<void> {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case "succeeded":
        this.showMessage("Payment succeeded!");

        await fetch('http://localhost:1000/invoiceSend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentIntent)
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log("Invoice data sent:", data);
          })
          .catch(error => {
            console.error("Error sending invoice data:", error);
          });


        console.log("Payment succeeded. Payment Intent Status:", paymentIntent);
        break;
      case "processing":
        this.showMessage("Your payment is processing.");
        console.log("Payment is processing. Payment Intent Status:", paymentIntent.status);
        break;
      case "requires_payment_method":
        this.showMessage("Your payment was not successful, please try again.");
        console.log("Payment requires a valid payment method. Payment Intent Status:", paymentIntent.status);
        break;
      default:
        this.showMessage("Something went wrong.");
        console.log("An unexpected error occurred. Payment Intent Status:", paymentIntent.status);
        break;
    }
  }
}

  // async ngOnInit(): Promise<any> {

  //   try {
  //     const response = await fetch('http://localhost:1000/getPaymentKeys');

  //     const data = await response.json();

  //     this.publicKey = data[0]?.keys[0]?.publicKey;

  //     this.stripe = Stripe(this.publicKey);

  //     console.log("service payment key ", this.publicKey)


  //   } catch (error) {
  //     console.error('Error loading Stripe scripts:', error);
  //   }

  // }