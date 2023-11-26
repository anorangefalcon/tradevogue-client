import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, filter, map, pairwise } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class LoginCheckService {

  private userSubject = new BehaviorSubject({});
  private user$ = this.userSubject.asObservable();

  private previousUrl: any = '/';
  constructor(private cookieService: CookieService, private router: Router, private toastService: ToastService) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([prevEvent, currentEvent]: [NavigationEnd, NavigationEnd]) => {
        console.log('prevous url is ',this.previousUrl);
        this.previousUrl = prevEvent.url; 
      });

    if (cookieService.get('userToken',)) {
      let userObj = {
        userToken : this.cookieService.get('userToken'),
        name: cookieService.get('name'),
        fcmToken: ''
      }
      this.userSubject.next({ 'user': userObj, 'loggedIn': true });

      if (Object.keys(this.userSubject.getValue()).length > 0) {
        return;
      }
      this.loginUser(userObj, false);
    }
  }

  loginUser(userObj: any, redirect: Boolean = true) {    
    this.cookieService.set('userToken', userObj.userToken, { path: '/' });
    this.cookieService.set('name', userObj.name, { path: '/' });
    this.userSubject.next({ 'user': userObj, 'loggedIn': true });

    if (this.cookieService.get('fcmToken')) {
      this.setFcmToken(this.cookieService.get('fcmToken'));
    }

    if (redirect) {
      if(this.previousUrl=='/cart' || this.previousUrl.includes('/explore')){
       this.router.navigate([this.previousUrl]);
      }  
      else this.router.navigate(['/']);
    }
  }

  logoutUser() {
    // this.cookieService.deleteAll();
    this.cookieService.delete('userToken', '/');
    this.cookieService.delete('name', '/');
    this.userSubject.next({ 'loggedIn': false })
    this.toastService.notificationToast({
      title: 'Logged Out Successfully'
    });

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
      })
    );
  }

}