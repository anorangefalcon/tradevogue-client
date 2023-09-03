import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerFetchDataService {

  url = '../../../assets/tempDB/seller.json';
  orderurl = '../../../assets/tempDB/orders.json'

  constructor(private http: HttpClient) { }

  detailedInfo(): Observable<any>{
    return this.http.get(this.url);
  }
  getFeatureInfo(){
    let feature: any = []
    this.detailedInfo().subscribe((data: any)=>{
      return data[0];
    });
  }

  getSellerInfo(){

  }

  getProductInfo(){

  }

  getOrderInfo(){
  }

}
