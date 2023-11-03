import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingResponseService {

  Address:any;
  PaymentStatus:any;

  BillingPageVisited=new BehaviorSubject(false);
  BillingpageVisited$=this.BillingPageVisited.asObservable();

  constructor() { }
}
