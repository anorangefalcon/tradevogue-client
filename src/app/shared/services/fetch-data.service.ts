import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable, filter, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl='../../../assets/tempDB/usersData.json';
  sellerUrl='../../../assets/tempDB/seller.json';
  constructor(private http: HttpClient) { }

  productKeys: any = ['available', 'colors', 'description', 'image', 'info', 'name', 'price', 'oldPrice', 'orderQuantity', 'reviews', 'sizes', 'sku', 'stockQuantity'];
  getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      map((arrayData: any) => {
          return arrayData.filter((item:any) => {
            
            return (Object.keys(item).length > 0) && (this.productKeys.length === Object.keys(item).length)
          });
      })
    )
  }

  getUserData():Observable<any>{
     return this.http.get(this.userUrl);
  }

  getSellerData():Observable<any>{
    return this.http.get(this.sellerUrl);
  }

  
  
  HttpPostRequest(url:any,body:any){
    return this.http.post(this.sellerUrl,body);
  }

  HttpGetRequest(url:any){
    return this.http.get(this.sellerUrl);
  }

  httpPost(url:any,body:any){
    return new Promise((res,rej)=>{
      
      this.http.post(url,body).subscribe({next:(data)=>{
        res(data);
      },error:(error)=>{
        console.log("erorr is ",error)
        rej(error)
      }})
    })
 
  }

  httpGet(url:any){

    return new Promise((res,rej)=>{
      this.http.get(url).subscribe({next:(data)=>{
        res(data);
        
      },error:(error)=>{
        rej(error)
      }})
    })
 
  }

}