import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, interval, throttle, throttleTime } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor( private cookies: CookieService) {}


  // Observable<HttpEvent<unknown>>
  intercept(request: HttpRequest<unknown>, next: HttpHandler):any  {
    
    let token = this.cookies.get('userToken');
    // console.log("Token is ",token);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);

    
  }
}
