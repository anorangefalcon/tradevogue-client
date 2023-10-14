import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor( private cookies: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let token = this.cookies.get('userToken');
    // console.log("Token is ",token);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request)
    // .pipe(
    //   map(event=>{
    //     console.log('EVENT COMIGN ISNIE INTERCEPTOR  IS ',event);
        

    //     return event;
    //   })
    // );
    
  }
}
