import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingResponseService {

  Address:any;
  PaymentStatus:any;

  BillingPageVisited = new BehaviorSubject(false);
  BillingpageVisited$ = this.BillingPageVisited.asObservable();


  private PaymentResponse=new BehaviorSubject(false);
  PaymentResponse$=this.PaymentResponse.asObservable();

  private selectedPaymentMethodSubject = new BehaviorSubject<string>(''); // Initial value is an empty string
  selectedPaymentMethod$ = this.selectedPaymentMethodSubject.asObservable();

  setSelectedPaymentMethod(paymentMethod: string) {
    this.selectedPaymentMethodSubject.next(paymentMethod);
  }
  constructor() { }
  

}
