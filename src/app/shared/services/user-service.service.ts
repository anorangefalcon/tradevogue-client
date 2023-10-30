import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {


   userSubect = new BehaviorSubject({});
   
   PaymentUrlVisited=new BehaviorSubject<any>('');
  paymentObservable=this.PaymentUrlVisited.asObservable();

  // when billing page refresh
  // couponApplied=new BehaviorSubject<any>('');
  

  constructor() { }

  

 async emittingValue(field:any,value:any){
   
    let data:any=await this.SubscribingValue(field);

    // if field does not exist
    if(!data){
      data=await this.SubscribingValue();
    }
    data[field]=value;
    return Promise.resolve(this.userSubect.next(data));  
  }

  SubscribingValue(field:any=''){
    return new Promise((res,rej)=>{
      this.userSubect.asObservable().subscribe((data:any)=>{
         if(!field){res(data); return;}
        res(data[field]);
      })
    })
  }

}
