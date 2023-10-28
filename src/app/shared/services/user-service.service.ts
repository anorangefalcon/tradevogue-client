import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {


   userSubect = new BehaviorSubject({});

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
