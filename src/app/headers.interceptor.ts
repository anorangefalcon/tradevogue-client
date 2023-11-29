import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { LoginCheckService } from './shared/services/login-check.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private userService: LoginCheckService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    this.userService.getUser('token').subscribe((token: any) => {
      if(token){  
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    })
    
    return next.handle(request);
  }
}
