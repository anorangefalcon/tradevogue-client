import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userSubect = new BehaviorSubject({});
  UserSubject = new BehaviorSubject<any>({});
  User$ = this.UserSubject.asObservable();

  PaymentUrlVisited=new BehaviorSubject<any>('');
  paymentObservable=this.PaymentUrlVisited.asObservable();

  userToken!: string;
  userName!: string;
  
  constructor(private cookie: CookieService, private backendUrls: UtilsModule, private http: HttpClient) {}


   

  // when billing page refresh
  // couponApplied=new BehaviorSubject<any>('');
  



  

//  async emittingValue(field:any,value:any){
   
//     let data:any=await this.SubscribingValue(field);

//     // if field does not exist
//     if(!data){
//       data=await this.SubscribingValue();
//     }
//     data[field]=value;
//     return Promise.resolve(this.userSubect.next(data));  
//   }

  // getValueFromCookie() {
  //   return { userToken: this.cookie.get('userToken'), userName: this.cookie.get('userName') };
  // }



  async emittingValue(field: any, value: any) {

    let data: any = await this.SubscribingValue(field);

    // if field does not exist
    if (!data) {
      data = await this.SubscribingValue();
    }
    data[field] = value;
    return Promise.resolve(this.userSubect.next(data));
  }

  loginUser(data: any) {
    return this.http.post(this.backendUrls.URLs.loginUrl, data);
  }


  SubscribingValue(field: any = '') {
    return new Promise((res, rej) => {
      this.userSubect.asObservable().subscribe((data: any) => {
        if (!field) { res(data); return; }
        res(data[field]);

      })
    })
  }

  // SubscribingUserSubject(field: any = '') {

  //   if (!field) {
  //     return this.User$;
  //   }

  //   else {
  //     return this.User$.pipe(
  //       map(data => data?.field)
  //     )
  //   }

  // }

  // EmittingUserSubject(field: any,value:any) {
  //   this.User$.subscribe((data) => {
  //     let newData=JSON.parse(JSON.stringify(data));
  //     newData.field=value;
  //     this.userSubect.next(newData);
  //   })
  // }

}
