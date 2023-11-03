import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeIsolateService {
  constructor() { }


  loadStripe(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const stripeScript = document.createElement('script');
      stripeScript.type = 'text/javascript';
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.onload = () => {
        const checkoutScript = document.createElement('script');
        checkoutScript.type = 'text/javascript';
        checkoutScript.src = 'http://localhost:1000/checkout.js';
        checkoutScript.onload = () => {
          resolve();
        };
        checkoutScript.onerror = reject;
        document.head.appendChild(checkoutScript);
      };
      stripeScript.onerror = reject;
      document.head.appendChild(stripeScript);
    });
  }
}