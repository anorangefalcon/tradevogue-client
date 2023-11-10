import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckService {

  private userSubject = new BehaviorSubject({});
  private user$ = this.userSubject.asObservable();

  constructor(private cookieService: CookieService, private router: Router) {
    if (cookieService.get('userToken')) {

      let userObj = {
        userToken: cookieService.get('userToken'),
        name: cookieService.get('name'),
        fcmToken: ''
      }

      if(Object.keys(this.userSubject.getValue()).length>0){
        return;
      }
      this.loginUser(userObj);
    }
    else {
      this.logoutUser();
    }
  }

  loginUser(userObj: any) {
    console.log('usreObjec is ',userObj);
    
    this.cookieService.set('userToken', userObj.userToken);
    this.cookieService.set('name', userObj.name);

    this.userSubject.next({ 'user': userObj, 'loggedIn': true });

    if(this.cookieService.get('fcmToken')){
      this.setFcmToken(this.cookieService.get('fcmToken'));
    }
    this.redirectToPreviousRoute();
  }

  logoutUser() {
    this.cookieService.delete('userToken');
    this.cookieService.delete('name');

    this.userSubject.next({ 'loggedIn': false })

    this.router.navigate(['/']);
  }

  setFcmToken(currentToken: any) {
    this.cookieService.set('fcmToken', currentToken);
    const obj: any = this.userSubject.getValue();
    obj.fcmToken = currentToken;

    this.userSubject.next(obj);
  }

  getUser(what: String = ''): Observable<any> {

    if ((what.toLowerCase()) == 'name') {
      return this.user$.pipe(
        map((data: any) => {
          return data.user?.name
        })
      );
    }
    else if ((what.toLowerCase()) == 'token') {
      return this.user$.pipe(
        map((data: any) => {
          return data.user?.userToken
        })
      );
    }
    else if ((what.toLowerCase()) == 'fcm') {
      return this.user$.pipe(
        map((data: any) => {
          return data.fcmToken
        })
      );
    }

    return this.user$.pipe(
      map((data: any) => {
        return data.loggedIn
      }));
  }

  redirectToPreviousRoute() {
    let previousUrl = '/';
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        previousUrl = event.url;
      });

    this.router.navigate([previousUrl]);
  }
}
