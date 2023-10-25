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
    if(!data){
      data=await this.SubscribingValue();
    }
    data[field]=value;
    console.log('data comes is ',data);
    // return new Promise(res,rej=>)
    return Promise.resolve(this.userSubect.next(data));
      this.userSubect.next(data);
      // console.log('DATA comes is ',dat);
      // return new Promise()
    
      data=await this.SubscribingValue();
      console.log('data comes after is ------- ',data);
      
      
  
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
