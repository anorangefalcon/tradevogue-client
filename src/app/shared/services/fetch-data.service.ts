import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Observable, Subject, filter, map, tap, BehaviorSubject, catchError } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root',
})

export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl = '../../../assets/tempDB/usersData.json';
  sellerUrl = '../../../assets/tempDB/seller.json';
  subject = new BehaviorSubject<any>('');
  subOb$ = this.subject.asObservable();
  ShowAddress = new Subject();

  constructor(private http: HttpClient, private toastService: ToastService, private backendUrls: UtilsModule, private route: ActivatedRoute) { }

  getUserData(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  getSellerData(): Observable<any> {
    return this.http.get(this.sellerUrl);
  }

  HttpPostRequest(url: any, body: any) {
    return this.http.post(this.sellerUrl, body);
  }

  HttpGetRequest(url: any) {
    return this.http.get(this.sellerUrl);
  }

  getUniqueProductFields(body : any){
    return this.http.post('http://localhost:1000/products/uniqueFields', body);
  }

  getProductDetails(sku: any) {
    let params = new HttpParams();
    params = params.set("sku", sku);
    // console.log('sky called by ----->');
    
    return this.http.get(this.backendUrls.URLs.fetchProductUrl, { params })
  }

  getProducts(data: any = '', limit: any = '', page: any = '') {
    let params = new HttpParams();
    // console.log(data, 'ts');

    (Object.keys(data)).forEach(key => {

      if (Array.isArray(data[key])) {
        data[key].forEach((element: any) => {
          params = params.append(key, element);
        });
      }
      else {
        params = params.set(key, data[key]);
      }
    }); 

    if(limit) params = params.set('limit', limit);
    if(page) params = params.set('page', page);

    console.log(" param si ",params);
    // console.log(" param si ",params);
    
    return this.http.get(this.backendUrls.URLs.fetchProducts, { params });
  }

  httpPost(url: any, body: any) {
    return new Promise((res, rej) => {
      this.http.post(url, body).subscribe({
        next: (data) => {
          console.log('DATA INSIDE NE', data);

            res(data);
          // console.log(data, "ervice data");


        }, error: (error) => {

          rej(error)


          if (error.message) {
            const data = { title: error.error.message };
            this.toastService.errorToast(data);
          }
        }
      })
    })
  }
  
  httpGet(url: any, data: any = null) {
    console.log('request of http get is ',url);
    
    let params = new HttpParams();

    if (data) {
      params = params.set("data", data);
    }
    return new Promise((res, rej) => {
      this.http.get(url, { params }).subscribe({
        next: (data) => {
          res(data);

        }, error: (error) => {

          rej(error)
          if (error.message) {
            const data = { title: error.error.message };
            this.toastService.errorToast(data);
          }
        }
      })
    });

  }

  HTTPGET(url: any, data: any = '', field: any = '') {
    let params;
    if (data) {
      params = new HttpParams();
      params = params.set(field, data); 
    }
    return this.http.get(url, { params });
  }

  HTTPPOST(url: any, body: any) {    
    return this.http.post(url, body);
  }
}