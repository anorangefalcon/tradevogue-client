import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerFetchDataService {

  url = '../../../assets/tempDB/seller.json';
  orderurl = '../../../assets/tempDB/orders.json'

  constructor(private http: HttpClient, private backendUrl: UtilsModule, private cookieService:CookieService) { }

  detailedInfo(): Observable<any>{
    return this.http.get(this.url);
  }
  getFeatureInfo(){
    let feature: any = []
    this.detailedInfo().subscribe((data: any)=>{
      return data[0];
    });
  }

  getSellerInfo(): Observable<any> {
    const userToken = this.cookieService.get('userToken');
    const params = new HttpParams().set('token', userToken);
  
    return this.http.get(this.backendUrl.URLs.getAccount, { params });
  }
  

  sendSellerInfo(data: any){
    this.http.post(this.backendUrl.URLs.updateAccount, {'data': data}).subscribe({
      next: (data) => {
        console.log('DATA INSIDE');
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR INSIDE');
        console.log(err);
      },
      complete: () => {
        console.log('COMPLETE INSIDE');
      }
    });
  }

  // sendPinInfo(data: any){
  //   this.http.post('http://localhost:4000/api/purchaser/sendPinInfo', {data}).subscribe({
  //     next: (data) => {
  //       console.log('DATA PIN INSIDE');
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.log('ERROR PIN INSIDE');
  //       console.log(err);
  //     },
  //     complete: () => {
  //       console.log('COMPLETE PIN INSIDE');
  //     }
  //   });
  // }

  sendPinInfo(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://localhost:4000/api/purchaser/sendPinInfo', data);
    
  }

  getProductInfo(){

  }

  getOrderInfo(){
  }

}
