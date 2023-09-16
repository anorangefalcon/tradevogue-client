import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl='../../../assets/tempDB/usersData.json';
  sellerUrl='../../../assets/tempDB/seller.json';
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.url);
  }

  getUserData():Observable<any>{
  
     return this.http.get(this.userUrl);
  }

  getSellerData():Observable<any>{
    return this.http.get(this.sellerUrl);
  }



}







