import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from './toast.service';
import {BehaviorSubject, catchError } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';
@Injectable({
  providedIn: 'root',
})

export class FetchDataService {

  theme = new BehaviorSubject<any>('false');
  themeColor$ = this.theme.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService, private backendUrls: UtilsModule) { }
  
  getProducts(data: any = '', limit: any = '', page: any = '') {
    let params = new HttpParams();

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
    return this.HTTPGET(this.backendUrls.URLs.fetchProducts, params );
  }

  HTTPGET(url: any, params:any='') {
    return this.http.get(url, { params }).pipe(
      catchError((error:any):any=>{
        this.toastService.errorToast(error);
    }));
  }

  HTTPPOST(url: any, body: any) {    
    return this.http.post(url, body).pipe(
      catchError((data):any =>{  
      this.toastService.errorToast({
        title: data.error.message
      });
    }));
  }
}