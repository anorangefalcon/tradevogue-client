import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckService {

  constructor(private cookieService:CookieService) { 
    if(cookieService.get('userToken')){
      let currentlogin=this.LoginCheck.value;
      if(!currentlogin) this.LoginCheck.next(true);
    }
  }

  LoginCheck=new BehaviorSubject(false);
  loginCheckObservable$=this.LoginCheck.asObservable();

}
