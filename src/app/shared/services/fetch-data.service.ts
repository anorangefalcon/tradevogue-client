import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from './toast.service';
import { BehaviorSubject, catchError } from 'rxjs';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})

export class FetchDataService {

  theme = new BehaviorSubject<Boolean>(false);
  themeColor$ = this.theme.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService, private backendUrls: UtilsModule, private cookieService: CookieService) {
    
    const isDeviceDarkThemed = (window.matchMedia("(prefers-color-scheme: dark)")).matches;
    if(isDeviceDarkThemed){
      $('#tv-body').toggleClass("dark");
      this.theme.next(true);
    }

    if (cookieService.get('theme')) {
      var isDark = /^true$/i.test(cookieService.get('theme'));
      this.toggleTheme(isDark);
    }

  }

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
    if (limit) params = params.set('limit', limit);
    if (page) params = params.set('page', page);
    return this.HTTPGET(this.backendUrls.URLs.fetchProducts, params);
  }

  HTTPGET(url: any, params: any = '') {
    return this.http.get(url, { params }).pipe(
      
      catchError((data: any): any => {
         if(data.error.message){
          this.toastService.errorToast({
            title: data.error.message
          });
        }
        else{
          this.toastService.errorToast({
            title: 'Internal Server Error'
          });
        }
      }));
  }

  HTTPPOST(url: any, body: any) {
    
    return this.http.post(url, body).pipe(
      catchError((data): any => {
        if(data.error.message){
          this.toastService.errorToast({
            title: data.error.message
          });
        }
        else{
          this.toastService.errorToast({
            title: 'Internal Server Error'
          });
        }
       
      }));
  }

  HTTPPATCH(url: any, body: any) {
    return this.http.patch(url, body).pipe(
      catchError((data): any => {
        if(data.error.message){
          this.toastService.errorToast({
            title: data.error.message
          });
        }
        else{
          this.toastService.errorToast({
            title: 'Internal Server Error'
          });
        }
       
      }));
  }

  HTTPDELETE(url: any, params: any) {
    console.log('url is  http delete run ',url);
    
    return this.http.delete(url, {params}).pipe(
      catchError((data): any => {
        if(data.error.message){
          this.toastService.errorToast({
            title: data.error.message
          });
        }
        else{
          this.toastService.errorToast({
            title: 'Internal Server Error'
          });
        }
       
      }));
  }

  // theming :
  toggleTheme(isDark: any) {
    this.theme.next(isDark);
    
    if(isDark) $('#tv-body').addClass("dark");
    else $('#tv-body').removeClass("dark");

    this.cookieService.set('theme', isDark, { path: '/' });
  }
}