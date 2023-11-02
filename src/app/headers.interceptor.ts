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

  API_Call(next:HttpHandler,request: HttpRequest<unknown>){
    return next.handle(request);
  }

  Better__API_call(fn:Function){
    let shouldWait=false;
    return ()=>{
     console.log('shoudl wait is ',shouldWait);
    if(shouldWait) return;
   return setTimeout(()=>{
     return fn();
      shouldWait=true;
    },500);
   } 

  }

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
    
    // return next.handle(request).pipe(throttleTime((500)))
    return next.handle(request);
  //  return this.Better__API_call(this.API_Call);

    // .pipe(
    //   map(event=>{
    //     console.log('EVENT COMIGN ISNIE INTERCEPTOR  IS ',event);
        

    //     return event;
    //   })
    // );
    
  }
}
